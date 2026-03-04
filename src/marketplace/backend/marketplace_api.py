import os
from datetime import datetime
from typing import Any

import semver
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, EmailStr, Field, HttpUrl
from sqlalchemy import Boolean, Column, DateTime, Float, Integer, JSON, String, create_engine, func
from sqlalchemy.orm import Session, declarative_base, sessionmaker

app = FastAPI(title="AutonomOS Skills Marketplace API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = "sqlite:///./marketplace.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class SkillDB(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    version = Column(String)
    description = Column(String)
    long_description = Column(String)
    author_name = Column(String)
    author_email = Column(String)
    category = Column(String, index=True)
    tags = Column(JSON)
    repository = Column(String)
    downloads = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    manifest = Column(JSON)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ReviewDB(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True)
    skill_name = Column(String, index=True)
    user_name = Column(String)
    rating = Column(Integer)
    comment = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


Base.metadata.create_all(bind=engine)


class SkillAuthor(BaseModel):
    name: str
    email: EmailStr
    url: HttpUrl | None = None


class SkillCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    name: str
    version: str
    description: str
    long_description: str | None = Field(default=None, alias="longDescription")
    author: SkillAuthor
    category: str
    tags: list[str] = Field(default_factory=list)
    repository: HttpUrl
    manifest: dict[str, Any]


class SkillResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    version: str
    description: str
    author_name: str
    category: str
    tags: list[str]
    repository: str
    downloads: int
    rating: float
    review_count: int
    verified: bool
    created_at: datetime
    icon: str | None = "📦"


class ReviewCreate(BaseModel):
    skill_name: str
    user_name: str
    rating: int
    comment: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


DB_DEP = Depends(get_db)


@app.get("/")
async def root() -> dict[str, Any]:
    return {
        "name": "AutonomOS Skills Marketplace",
        "version": "1.0.0",
        "endpoints": {
            "skills": "/skills",
            "categories": "/categories",
            "search": "/search",
            "popular": "/popular",
        },
    }


@app.get("/skills", response_model=list[SkillResponse])
async def list_skills(
    category: str | None = None,
    tag: str | None = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = DB_DEP,
) -> list[SkillDB]:
    """List all skills with optional filtering."""
    query = db.query(SkillDB)

    if category:
        query = query.filter(SkillDB.category == category)
    if tag:
        query = query.filter(SkillDB.tags.contains([tag]))

    return query.offset(skip).limit(limit).all()


@app.get("/skills/{skill_name}", response_model=SkillResponse)
async def get_skill(skill_name: str, db: Session = DB_DEP) -> SkillDB:
    """Get detailed skill information."""
    skill = db.query(SkillDB).filter(SkillDB.name == skill_name).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill


@app.post("/skills", response_model=SkillResponse)
async def publish_skill(skill: SkillCreate, db: Session = DB_DEP) -> SkillDB:
    """Publish a new skill to the marketplace."""
    existing = db.query(SkillDB).filter(SkillDB.name == skill.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Skill already exists")

    try:
        semver.VersionInfo.parse(skill.version)
    except ValueError as err:
        raise HTTPException(status_code=400, detail="Invalid version format") from err

    db_skill = SkillDB(
        name=skill.name,
        version=skill.version,
        description=skill.description,
        long_description=skill.long_description,
        author_name=skill.author.name,
        author_email=str(skill.author.email),
        category=skill.category,
        tags=skill.tags,
        repository=str(skill.repository),
        manifest=skill.manifest,
    )

    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill


@app.post("/skills/{skill_name}/install")
async def install_skill(skill_name: str, db: Session = DB_DEP) -> dict[str, Any]:
    """Track skill installation."""
    skill = db.query(SkillDB).filter(SkillDB.name == skill_name).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    skill.downloads += 1
    db.commit()

    return {"status": "success", "skill": skill_name, "downloads": skill.downloads}


@app.get("/search", response_model=list[SkillResponse])
async def search_skills(
    q: str = Query(..., min_length=1),
    db: Session = DB_DEP,
) -> list[SkillResponse]:
    """Search skills by name, description, or tags."""
    skills = (
        db.query(SkillDB)
        .filter(
            (SkillDB.name.contains(q))
            | (SkillDB.description.contains(q))
            | (SkillDB.tags.contains([q]))
        )
        .limit(20)
        .all()
    )

    return [SkillResponse.model_validate(skill) for skill in skills]


@app.get("/categories")
async def list_categories(db: Session = DB_DEP) -> list[dict[str, Any]]:
    """List all skill categories with counts."""
    categories = (
        db.query(SkillDB.category, func.count(SkillDB.id).label("count"))
        .group_by(SkillDB.category)
        .all()
    )

    return [{"name": cat, "count": count} for cat, count in categories]


@app.get("/popular", response_model=list[SkillResponse])
async def get_popular_skills(limit: int = 10, db: Session = DB_DEP) -> list[SkillDB]:
    """Get most downloaded skills."""
    return db.query(SkillDB).order_by(SkillDB.downloads.desc()).limit(limit).all()


@app.get("/featured", response_model=list[SkillResponse])
async def get_featured_skills(db: Session = DB_DEP) -> list[SkillDB]:
    """Get verified/featured skills."""
    return (
        db.query(SkillDB)
        .filter(SkillDB.verified.is_(True))
        .order_by(SkillDB.rating.desc())
        .limit(6)
        .all()
    )


@app.post("/reviews")
async def create_review(review: ReviewCreate, db: Session = DB_DEP) -> dict[str, Any]:
    """Submit a skill review."""
    if not 1 <= review.rating <= 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    db_review = ReviewDB(**review.model_dump())
    db.add(db_review)

    skill = db.query(SkillDB).filter(SkillDB.name == review.skill_name).first()
    if skill:
        reviews = db.query(ReviewDB).filter(ReviewDB.skill_name == review.skill_name).all()
        total_rating = sum(r.rating for r in reviews)
        skill.rating = total_rating / len(reviews)
        skill.review_count = len(reviews)

    db.commit()
    return {"status": "success", "review_id": db_review.id}


@app.get("/skills/{skill_name}/reviews")
async def get_reviews(skill_name: str, db: Session = DB_DEP) -> list[ReviewDB]:
    """Get all reviews for a skill."""
    return (
        db.query(ReviewDB)
        .filter(ReviewDB.skill_name == skill_name)
        .order_by(ReviewDB.created_at.desc())
        .all()
    )


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("AUTONOMOS_MARKETPLACE_API_HOST", "127.0.0.1")
    port = int(os.getenv("AUTONOMOS_MARKETPLACE_API_PORT", "8001"))
    uvicorn.run(app, host=host, port=port)
