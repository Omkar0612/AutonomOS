# 📥 Export Features Documentation

## Overview

AutonomOS provides **7 professional export formats** for your workflow execution results, making it easy to share, present, and analyze your AI agent outputs.

---

## 🎯 Available Export Formats

### 1️⃣ **PDF Export** 📝
**Best for:** Professional reports, printing, archiving

**Features:**
- Multi-page formatted document
- Color-coded status indicators
- Professional typography
- Page numbers and metadata
- Print-ready layout

**Use Cases:**
- Client deliverables
- Documentation
- Compliance records
- Executive summaries

---

### 2️⃣ **Word Export** (DOCX) 📝
**Best for:** Editable documents, collaborative editing

**Features:**
- Full Microsoft Word compatibility
- Rich text formatting
- Editable structure
- Color-coded status
- Headers and styles

**Use Cases:**
- Team collaboration
- Report customization
- Content editing
- Template creation

---

### 3️⃣ **Excel Export** (XLSX) 📚
**Best for:** Data analysis, charts, pivot tables

**Features:**
- Multiple worksheets (Summary + Results)
- Formatted tables
- Professional styling
- Ready for charts/graphs
- Sortable/filterable data

**Worksheets:**
- **Summary:** Workflow metadata
- **Results:** Detailed node results

**Use Cases:**
- Performance tracking
- Data analysis
- Metrics dashboards
- Historical comparisons

---

### 4️⃣ **PowerPoint Export** (PPTX) 📊
**Best for:** Presentations, stakeholder meetings

**Features:**
- Professional slide deck
- Title slide with workflow name
- Summary slide with metrics
- One slide per node result
- Branded color scheme

**Slide Structure:**
1. Title slide
2. Execution summary
3. Node results (one per slide)

**Use Cases:**
- Client presentations
- Team meetings
- Status updates
- Demo/training sessions

---

### 5️⃣ **JSON Export** 📦
**Best for:** API integration, programmatic access

**Features:**
- Complete raw data
- Machine-readable format
- Nested structure preserved
- Easy parsing

**Use Cases:**
- API integration
- Data pipelines
- Automated workflows
- Backup/restore

---

### 6️⃣ **CSV Export** 📊
**Best for:** Spreadsheet import, simple data analysis

**Features:**
- Universal compatibility
- Lightweight format
- Easy import to Excel/Sheets
- One row per node

**Use Cases:**
- Quick analysis
- Database import
- Bulk processing
- Legacy system compatibility

---

### 7️⃣ **Markdown Export** 📝
**Best for:** Documentation, GitHub, wikis

**Features:**
- Human-readable format
- GitHub-flavored markdown
- Code blocks for outputs
- Section headers
- Easy version control

**Use Cases:**
- Documentation sites
- GitHub README
- Wikis/knowledge bases
- Developer notes

---

## 🛠️ How to Use

### Step 1: Execute Workflow
1. Build your workflow in the canvas
2. Click **"Execute"** button
3. Wait for completion

### Step 2: View Results
1. Results panel slides up from bottom
2. Shows all node outputs and status
3. Color-coded success/error indicators

### Step 3: Export
1. Click any export button at the top
2. Choose your format:
   - **PDF** - Professional report
   - **Word** - Editable document
   - **Excel** - Data & charts
   - **PowerPoint** - Presentation
   - **JSON** - Raw data
   - **CSV** - Spreadsheet
   - **Markdown** - Documentation
3. File downloads automatically

---

## 🎨 UI Features

### Modern Design
- ✨ Glassmorphic interface
- 💠 Smooth animations
- 🎨 Color-coded status badges
- 📊 Success/error counters
- 📋 One-click copy all results

### Results Display
- **Node Cards:** Each node result in its own card
- **Status Badges:** Green (success) / Red (error)
- **Type Tags:** Shows node type
- **Task Display:** Shows what the agent was asked to do
- **Output Boxes:** Formatted output with syntax highlighting
- **Error Boxes:** Red-highlighted errors for quick identification

---

## 💻 Technical Details

### Dependencies
```json
{
  "jspdf": "^2.5.1",          // PDF generation
  "docx": "^8.5.0",           // Word documents
  "file-saver": "^2.0.5",     // File download
  "exceljs": "^4.4.0",        // Excel spreadsheets
  "pptxgenjs": "^3.12.0"      // PowerPoint presentations
}
```

### File Naming Convention
```
{workflowName}_results_{timestamp}.{extension}

Examples:
workflow_results_1709635200000.pdf
workflow_results_1709635200000.docx
workflow_results_1709635200000.xlsx
workflow_results_1709635200000.pptx
```

### Export Functions

#### PDF Export
```typescript
exportToPDF(result: WorkflowExecutionResult, workflowName: string)
```
- Multi-page layout
- A4 format
- Professional typography
- Page numbering

#### Word Export
```typescript
exportToWord(result: WorkflowExecutionResult, workflowName: string)
```
- DOCX format (Office Open XML)
- Rich text formatting
- Styled paragraphs
- Color-coded status

#### Excel Export
```typescript
exportToExcel(result: WorkflowExecutionResult, workflowName: string)
```
- XLSX format
- Multiple worksheets
- Formatted tables
- Professional styling

#### PowerPoint Export
```typescript
exportToPowerPoint(result: WorkflowExecutionResult, workflowName: string)
```
- PPTX format
- Multiple slides
- Branded design
- Professional layout

---

## 🚀 Example Workflow

### Scenario: Content Generation Workflow

**Nodes:**
1. **Trigger:** Start workflow
2. **Agent 1:** Write blog post outline
3. **Agent 2:** Generate introduction
4. **Agent 3:** Write main content
5. **Agent 4:** Create conclusion

**After Execution:**
1. View all 5 outputs in results panel
2. Export as **Word** to edit/customize
3. Export as **PDF** for client review
4. Export as **PowerPoint** for team presentation
5. Export as **Excel** to track performance metrics

---

## 📊 Example Export Output

### PDF Preview
```
🚀 Workflow Execution Results

Workflow: content-generation
Date: March 5, 2026
Provider: openrouter
Model: meta-llama/llama-3.3-70b-instruct:free
Status: success
Nodes: 5

---

📦 Node: agent-1
✅ SUCCESS
Task: Write blog post outline
Output: [AI-generated outline...]

📦 Node: agent-2
✅ SUCCESS
Task: Generate introduction
Output: [AI-generated intro...]

...
```

### PowerPoint Preview
```
Slide 1: Title
  🚀 Workflow Results
  content-generation

Slide 2: Summary
  Date: March 5, 2026
  Provider: openrouter
  Nodes: 5
  Success: 5 | Errors: 0

Slide 3-7: Individual node results
  One slide per node with output
```

---

## ✨ Advanced Features

### Auto-Format Detection
The export system intelligently formats content based on:
- Output length (truncates for PowerPoint)
- Special characters (escapes for HTML/PDF)
- Code blocks (monospace for technical content)
- Error messages (red highlighting)

### Copy to Clipboard
- Click the **Copy** button to copy all results
- Formatted as plain text
- Easy paste into emails/chats

### Export Queue
- Multiple exports can be triggered
- Loading indicators for each format
- Non-blocking UI during export

---

## 🔧 Customization

### Modify Export Templates

Edit `frontend/src/utils/export-advanced.ts` to customize:

**PDF Styling:**
```typescript
doc.setFontSize(24)
doc.setTextColor(139, 92, 246) // Change color
```

**Word Styling:**
```typescript
new Paragraph({
  heading: HeadingLevel.TITLE,
  alignment: AlignmentType.CENTER,
})
```

**Excel Colors:**
```typescript
fill: {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FF8B5CF6' }, // Change color
}
```

**PowerPoint Theme:**
```typescript
titleSlide.background = { color: '8B5CF6' } // Change background
```

---

## 📚 Best Practices

### When to Use Each Format

| Format | Best For | File Size | Editability |
|--------|----------|-----------|-------------|
| PDF | Printing, archiving | Medium | None |
| Word | Collaboration | Small | High |
| Excel | Analysis | Small | High |
| PowerPoint | Presentations | Medium | High |
| JSON | Integration | Smallest | None |
| CSV | Quick analysis | Smallest | Medium |
| Markdown | Documentation | Smallest | High |

### File Organization
```
downloads/
├── workflow_results_2026-03-05.pdf
├── workflow_results_2026-03-05.docx
├── workflow_results_2026-03-05.xlsx
├── workflow_results_2026-03-05.pptx
└── workflow_results_2026-03-05.json
```

---

## 🔐 Security

- ✅ All exports happen **client-side** (in browser)
- ✅ No data sent to external servers
- ✅ API keys **NOT included** in exports
- ✅ Files saved directly to your computer
- ✅ Full privacy and control

---

## 🐛 Troubleshooting

### Export button not working?
1. Check browser console for errors
2. Ensure results panel is open
3. Try refreshing the page

### File not downloading?
1. Check browser download settings
2. Allow popups for localhost
3. Check disk space

### Large outputs causing issues?
1. PowerPoint truncates at 500 chars per slide
2. PDF may span multiple pages
3. Excel handles large data well

---

## 💬 Support

For issues or feature requests:
- GitHub Issues: [AutonomOS Issues](https://github.com/Omkar0612/AutonomOS/issues)
- Contact: omkarparab@example.com

---

**Made with ❤️ by AutonomOS Team**
