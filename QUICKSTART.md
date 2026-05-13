# Quick Start Guide - Advanced Search & CSV Export

## What's New

Your Carrier Snapshot app now has two powerful features your team requested:

### ✅ Advanced Search
Multiple filter options to find exactly the carriers you need

### ✅ CSV Export
Download search results directly to Excel or Google Sheets

---

## Getting Started

### The Interface

When you load the app, you'll see two search mode options:

```
[Basic Search] [Advanced Search]
```

---

### Using Basic Search (Quick & Simple)

**Default mode** - Search by any identifier

1. Enter in the search box:
   - Company name (e.g., "Schneider")
   - DOT number (e.g., "1677170")
   - MC number (e.g., "MC123456")

2. Press Enter or click "Search"

3. Click "Select" on any result to view full details

---

### Using Advanced Search (Powerful Filtering)

1. Click **"Advanced Search"** tab

2. Fill in your search criteria:

   | Field | Example | Notes |
   |-------|---------|-------|
   | Company Name | Optional | Leave blank to search all |
   | Status | Active Only | Filter by operational status |
   | State | TX, CA, NY | 2-letter state code |
   | City | Dallas | Optional, use with State |
   | Min Power Units | 5 | Leave blank for 0 |
   | Max Power Units | 50 | Leave blank for unlimited |
   | Authority Type | Common Carrier | Optional |

3. Click **"Search"** button

4. View filtered results in the table below

5. Click **"Select"** on any carrier to see full snapshot

---

### Exporting Results to CSV

After performing any search (Basic or Advanced):

1. Look at the results table
2. Click the **"📥 Export CSV"** button (top right)
3. File downloads as: `carrier-search-2026-05-13.csv`
4. Open in Excel or Google Sheets

**What's in the CSV:**
- Company name
- DOT & MC numbers
- Status (Active/Inactive)
- Location (City, State)
- Power units (fleet size)
- Phone number
- MCS-150 date

---

## Common Search Scenarios

### Scenario 1: Find All Active Carriers in a State
```
Mode: Advanced Search
- State: TX
- Status: Active Only
- Power Units: (leave blank)
Click Search → Export to CSV
```

### Scenario 2: Find a Specific Company
```
Mode: Basic Search
- Search Box: "Company Name" or "DOT123456"
Click Search → View Details
```

### Scenario 3: Find Mid-Size Carriers in a Region
```
Mode: Advanced Search
- State: CA
- Min Power Units: 10
- Max Power Units: 100
- Status: Active Only
Click Search → Export to CSV
```

### Scenario 4: Find Brokers Authorized in New York
```
Mode: Advanced Search
- State: NY
- Authority: Broker
- Status: Active Only
Click Search → Export to CSV
```

---

## Tips & Tricks

### Search Tips
- ✓ At least one filter is required in Advanced Search
- ✓ Use State filter for fastest results
- ✓ Combine filters for more precise results
- ✓ Basic Search accepts partial company names

### Export Tips
- ✓ CSV files are timestamped automatically
- ✓ Perfect for Excel mail merge campaigns
- ✓ Import into CRM systems (Salesforce, HubSpot)
- ✓ Use for team analysis and outreach

### Performance Tips
- ✓ More specific filters = faster searches
- ✓ State-based searches are most efficient
- ✓ Avoid very broad searches across all US

---

## Keyboard Shortcuts

- **Enter** in Basic Search box = Execute search
- **Tab** between Advanced Search fields
- **Ctrl+S** (or Cmd+S) = Save CSV file (after clicking Export)

---

## Understanding the Results

### Table Columns
| Column | Meaning |
|--------|---------|
| **Legal Name** | Official company name |
| **DOT Number** | FMCSA DOT identifier |
| **MC/Docket** | Motor Carrier number |
| **Status** | Green (Active) / Red (Inactive) |
| **Location** | City, State |
| **Units** | Number of power units (trucks) |
| **Action** | "Select" to view full details |

### Status Colors
- 🟢 **Green** = Active (authorized to operate)
- 🔴 **Red** = Inactive (not operating)

---

## Detailed View

After clicking "Select" on a carrier, you'll see:

### Sections Included:
1. **Company Overview** - Name, DOT, Status
2. **Contact Information** - Owner, phone, email
3. **Business Details** - Address, MCS-150 date
4. **Key Metrics** - Fleet size, crashes, drivers
5. **Authority Status** - Operating authority types
6. **Insurance Summary** - Coverage and compliance
7. **Safety Metrics** - CSA BASIC scores, OOS rates
8. **Operations** - Authority classifications, cargo types

### Navigation:
- Click "← Back to Results" to return to search results
- Click "New Search" to start over with different criteria

---

## Troubleshooting

### "No carriers found"
- Try fewer filters
- Check spelling of company name
- Verify state abbreviation is correct
- Try a broader date range

### CSV file not downloading
- Check browser download settings
- Disable any pop-up blockers
- Try again with fewer results
- Try a different browser

### Search is slow
- Use State filter to narrow results
- Add more specific criteria
- Check your internet connection

---

## Team Workflow Suggestion

### For Outreach/Sales Team:
1. Use Advanced Search to find target carriers by location & size
2. Export results to CSV
3. Use for mail merge or email campaign
4. Import into your CRM

### For Compliance Team:
1. Search for carriers in your network
2. View detailed snapshots for each carrier
3. Check insurance and authority status
4. Export for compliance reports

### For Analysis Team:
1. Perform multiple searches by region
2. Export each to CSV with date-stamped filename
3. Combine CSVs for regional analysis
4. Track carrier changes over time

---

## Data Privacy & Usage

- **Personal Data:** Phone numbers shown are business contact info from public FMCSA records
- **Accuracy:** Data is pulled from official FMCSA and DOT databases in real-time
- **Updates:** Information refreshes with each search (not cached)
- **Export Usage:** You own the exported data - use for legitimate business purposes

---

## Questions?

Refer to the full **FEATURES.md** documentation for:
- Technical details
- Advanced use cases
- Future roadmap
- Comparison with BrokerSnapshot

---

**Happy Searching! 🚚**
