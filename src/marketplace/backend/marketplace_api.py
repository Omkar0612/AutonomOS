from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, HttpUrl
from typing import List, Optional, Dict, Any
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, DateTime, JSON, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, sessionmaker
import semver

app = FastAPI(title="AutonomOS Skills Marketplace API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DATABASE_URL = "sqlite:///./marketplace.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
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

# Pydantic schemas
class SkillAuthor(BaseModel):
    name: str
    email: EmailStr
    url: Optional[HttpUrl] = None

class SkillCreate(BaseModel):
    name: str
    version: str
    description: str
    longDescription: Optional[str] = None
    author: SkillAuthor
    category: str
    tags: List[str] = []
    repository: HttpUrl
    manifest: Dict[str, Any]

class SkillResponse(BaseModel):
    id: int
    name: str
    version: str
    description: str
    author_name: str
    category: str
    tags: List[str]
    repository: str
    downloads: int
    rating: float
    review_count: int
    verified: bool
    created_at: datetime
    icon: Optional[str] = "📦"
    
    class Config:
        from_attributes = True

class ReviewCreate(BaseModel):
    skill_name: str
    user_name: str
    rating: int  # 1-5
    comment: str

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoints
@app.get("/")
async def root():
    return {
        "name": "AutonomOS Skills Marketplace",
        "version": "1.0.0",
        "endpoints": {
            "skills": "/skills",
            "categories": "/categories",
            "search": "/search",
            "popular": "/popular"
        }
    }

@app.get("/skills", response_model=List[SkillResponse])
async def list_skills(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """List all skills with optional filtering"""
    query = db.query(SkillDB)
    
    if category:
        query = query.filter(SkillDB.category == category)
    if tag:
        query = query.filter(SkillDB.tags.contains([tag]))
    
    skills = query.offset(skip).limit(limit).all()
    return skills

@app.get("/skills/{skill_name}", response_model=SkillResponse)
async def get_skill(skill_name: str, db: Session = Depends(get_db)):
    """Get detailed skill information"""
    skill = db.query(SkillDB).filter(SkillDB.name == skill_name).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill

@app.post("/skills", response_model=SkillResponse)
async def publish_skill(skill: SkillCreate, db: Session = Depends(get_db)):
    """Publish a new skill to the marketplace"""
    # Check if skill already exists
    existing = db.query(SkillDB).filter(SkillDB.name == skill.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Skill already exists")
    
    # Validate semver
    try:
        semver.VersionInfo.parse(skill.version)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid version format")
    
    db_skill = SkillDB(
        name=skill.name,
        version=skill.version,
        description=skill.description,
        long_description=skill.longDescription,
        author_name=skill.author.name,
        author_email=skill.author.email,
        category=skill.category,
        tags=skill.tags,
        repository=str(skill.repository),
        manifest=skill.manifest
    )
    
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@app.post("/skills/{skill_name}/install")
async def install_skill(skill_name: str, db: Session = Depends(get_db)):
    """Track skill installation"""
    skill = db.query(SkillDB).filter(SkillDB.name == skill_name).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    skill.downloads += 1
    db.commit()
    
    return {
        "status": "success",
        "skill": skill_name,
        "downloads": skill.downloads
    }

@app.get("/search")
async def search_skills(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    """Search skills by name, description, or tags"""
    skills = db.query(SkillDB).filter(
        (SkillDB.name.contains(q)) |
        (SkillDB.description.contains(q)) |
        (SkillDB.tags.contains([q]))
    ).limit(20).all()
    
    return [SkillResponse.from_orm(skill) for skill in skills]

@app.get("/categories")
async def list_categories(db: Session = Depends(get_db)):
    """List all skill categories with counts"""
    categories = db.query(
        SkillDB.category,
        db.func.count(SkillDB.id).label('count')
    ).group_by(SkillDB.category).all()
    
    return [{"name": cat, "count": count} for cat, count in categories]

@app.get("/popular", response_model=List[SkillResponse])
async def get_popular_skills(limit: int = 10, db: Session = Depends(get_db)):
    """Get most downloaded skills"""
    skills = db.query(SkillDB).order_by(
        SkillDB.downloads.desc()
    ).limit(limit).all()
    return skills

@app.get("/featured", response_model=List[SkillResponse])
async def get_featured_skills(db: Session = Depends(get_db)):
    """Get verified/featured skills"""
    skills = db.query(SkillDB).filter(
        SkillDB.verified == True
    ).order_by(SkillDB.rating.desc()).limit(6).all()
    return skills

@app.post("/reviews")
async def create_review(review: ReviewCreate, db: Session = Depends(get_db)):
    """Submit a skill review"""
    if not 1 <= review.rating <= 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    db_review = ReviewDB(**review.dict())
    db.add(db_review)
    
    # Update skill rating
    skill = db.query(SkillDB).filter(SkillDB.name == review.skill_name).first()
    if skill:
        reviews = db.query(ReviewDB).filter(ReviewDB.skill_name == review.skill_name).all()
        total_rating = sum(r.rating for r in reviews)
        skill.rating = total_rating / len(reviews)
        skill.review_count = len(reviews)
    
    db.commit()
    return {"status": "success", "review_id": db_review.id}

@app.get("/skills/{skill_name}/reviews")
async def get_reviews(skill_name: str, db: Session = Depends(get_db)):
    """Get all reviews for a skill"""
    reviews = db.query(ReviewDB).filter(
        ReviewDB.skill_name == skill_name
    ).order_by(ReviewDB.created_at.desc()).all()
    return reviews

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
