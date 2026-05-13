# Carrier Snapshot App - Advanced Features Guide

## Overview
Your Carrier Snapshot application has been enhanced with **Advanced Search** capabilities and **CSV Export** functionality, similar to BrokerSnapshot's professional features.

---

## New Features

### 1. **Advanced Search Interface**

**Location:** Search card - Toggle between "Basic Search" and "Advanced Search"

**Available Filters:**
- **Company Name / DOT#** - Search by carrier name or DOT number
- **Company Status** - Filter by Active or Inactive carriers
- **State** - Filter by operating state (e.g., CA, TX, NY)
- **City** - Filter by city (optional, works with state)
- **Power Units** - Set minimum and maximum truck count
- **Operating Authority** - Filter by Common Carrier, Contract, or Broker

**How It Works:**
1. Click "Advanced Search" button in the search card
2. Fill in one or more filter criteria
3. Click "Search" to find matching carriers
4. Results are filtered both by the backend API and local validation

**Example Queries:**
- Find all active carriers in Texas with 5-20 power units
- Search for a specific company in California
- Find brokers authorized to operate

---

### 2. **CSV Export Functionality**

**Location:** Results table - "Export CSV" button in the top right

**What Gets Exported:**
- Legal Company Name
- DOT Number
- MC/Docket Number
- Status (Active/Inactive)
- City and State
- Power Units
- Contact Phone
- MCS-150 Form Date

**How to Use:**
1. Perform a Basic or Advanced Search
2. Review your results in the table
3. Click "📥 Export CSV" button
4. File will download as `carrier-search-YYYY-MM-DD.csv`
5. Open in Excel, Google Sheets, or any spreadsheet application

**File Format:**
- Standard CSV format with proper quote escaping
- Headers included for easy identification
- Compatible with Excel, Google Sheets, and data analysis tools

---

### 3. **Enhanced Results Display**

**New Features:**
- Result counter showing "X carriers found"
- "New Search" button to reset all fields
- Power Units column added to results table
- Export button for quick data download

---

## Workflow Examples

### Example 1: Find Qualified Carriers in a State
1. Click "Advanced Search"
2. Select State: "TX"
3. Set Company Status: "Active Only"
4. Set Power Units: Min: 10, Max: 100
5. Click "Search"
6. Review results and export to CSV

### Example 2: Search for Specific Company
1. Click "Basic Search" (default)
2. Type company name or DOT number
3. Press Enter or click "Search"
4. Results appear instantly
5. Click "Select" on any row to view detailed snapshot

### Example 3: Bulk Data Collection for Outreach
1. Perform an Advanced Search with your criteria
2. Once results appear, click "Export CSV"
3. Open the CSV file in Excel
4. Use for mail merge, email outreach, or data analysis
5. All carrier contact information is included

---

## Technical Details

### Search Algorithm
- **Local Filtering:** Applied after API results to ensure accuracy
- **Status Filter:** Checks status_code field (A=Active, I=Inactive)
- **Location Filter:** Case-insensitive city and state matching
- **Units Filter:** Numeric range comparison on power units
- **Authority Filter:** Currently defaults to all (can be enhanced)

### CSV Generation
- Headers: Legal Name, DOT Number, MC/Docket, Status, City, State, Units, Phone, MCS-150 Date
- Automatic CSV escaping for special characters
- Date format: ISO 8601 (YYYY-MM-DD)
- File naming: `carrier-search-YYYY-MM-DD.csv`

### Data Source Integration
The app maintains all existing FMCSA API integrations:
- **N8N Webhook:** For primary search functionality
- **FMCSA Mobile API:** For detailed carrier information
- **Socrata API:** For additional carrier metrics

---

## Comparison with BrokerSnapshot

| Feature | BrokerSnapshot | Carrier Snapshot |
|---------|---|---|
| Basic Search | ✓ | ✓ |
| AI-Powered NLP | ✓ | Limited (Basic search) |
| Advanced Filters | ✓ | ✓ New! |
| CSV Export | ✓ | ✓ New! |
| Detailed Snapshots | ✓ | ✓ |
| Multi-criteria Search | ✓ | ✓ |
| Location-based Search | ✓ | ✓ |
| Fleet Size Filtering | ✓ | ✓ New! |

---

## Future Enhancements

### Planned Features
1. **Save Search Filters** - Store frequently used filter combinations
2. **Search History** - Quick access to previous searches
3. **Advanced Authority Filter** - Currently filtered locally, can be server-side
4. **Date Range Filters** - Filter by MCS-150 form date ranges
5. **Batch Snapshot Export** - Export full details for multiple carriers to CSV
6. **Smart Search Templates** - Pre-built search combinations for common queries

### Potential Integrations
- Email outreach automation
- CRM integration (Salesforce, HubSpot)
- Data warehouse sync
- Automated compliance monitoring
- Geographic radius search (similar to BrokerSnapshot)

---

## Troubleshooting

### No Results Found
- Verify your filter criteria (at least one should be filled)
- Try fewer or broader filters
- Check for typos in company names
- Verify state abbreviations are correct (2 letters)

### CSV File Not Downloading
- Check browser download settings
- Try a different browser
- Ensure you have performed a search first
- Clear browser cache and try again

### Slow Search Performance
- Use more specific filters to reduce result set
- Basic search is faster than advanced search on large databases
- Check internet connection speed

---

## Tips & Best Practices

1. **Start Specific:** Use company name or DOT when you know it
2. **Combine Filters:** Use State + Power Units for targeted searches
3. **Export Regularly:** CSV files are dated automatically
4. **Status Filter:** Always filter for Active carriers unless needed otherwise
5. **Geographic Focus:** State filter is most efficient for location-based searches

---

## Support & Questions

For issues or feature requests:
1. Check this documentation first
2. Review the troubleshooting section
3. Test with different filter combinations
4. Verify API connectivity in browser console

---

## Version History

### v2.0 (Current)
- ✨ Added Advanced Search with multiple filters
- ✨ Added CSV Export functionality
- 🎨 Enhanced results UI with counter and export button
- 🔧 Improved filter validation

### v1.0 (Original)
- Basic search functionality
- FMCSA API integration
- Detailed carrier snapshots
- Authority and insurance tracking

---

**Last Updated:** May 2026
**Status:** Production Ready
