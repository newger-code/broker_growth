# Geospatial Overlay Layers

This dashboard includes 4 complete geospatial overlay layers for property analysis.

## Available Layers

### 1. Power Transmission Lines (97 MB)
- **Source**: HIFLD (Homeland Infrastructure Foundation-Level Data)
- **Features**: 52,244 transmission lines
- **Data**: Voltage levels, owner information, status
- **Coverage**: Complete US dataset
- **Style**: Red dashed lines (#ef4444)
- **Use Case**: Identify properties near high-voltage transmission corridors

### 2. Railroads (355 MB)
- **Source**: BTS North American Rail Network (NTAD)
- **Features**: 302,638 railroad segments
- **Data**: Railroad owner, class, status
- **Coverage**: Complete US rail network
- **Style**: Purple dashed lines (#a855f7)
- **Use Case**: Analyze proximity to freight and passenger rail

### 3. Cell Towers (11 MB)
- **Source**: HIFLD/NASA Communications Dataset
- **Features**: ~50,000+ cell tower locations
- **Data**: Site names, coordinates
- **Coverage**: FCC-registered towers (subset of all towers)
- **Style**: Green circular markers (#22c55e)
- **Use Case**: Evaluate cellular coverage near properties

### 4. Starbucks Locations (3.4 MB)
- **Source**: GitHub chrismeller/StarbucksLocations
- **Features**: 13,608 US Starbucks stores
- **Data**: Store names, addresses, cities, states
- **Coverage**: All US Starbucks locations
- **Style**: Dark green markers (#00704A)
- **Use Case**: Proxy for retail density and walkability

## Total Dataset Size
**467 MB** across 4 layers

## How to Use

1. Start local server: `npx http-server reconciled/full_dashboard -p 8080`
2. Open http://localhost:8080
3. Click "Geographic Intelligence" tab
4. Toggle overlay checkboxes on the right to show/hide layers
5. Zoom in/out to see different detail levels
6. Click on features to see popup information

## Implementation Details

### Data Download
- Complete datasets downloaded using pagination to bypass API transfer limits
- Python scripts in `scripts/geospatial_processing/`:
  - `download_full_arcgis_dataset.py` - Downloads Power Lines, Railroads, Cell Towers
  - `convert_starbucks_to_geojson.py` - Converts Starbucks CSV to GeoJSON

### Code Integration
- Configuration: `js/tabs/geographic.js` lines 31-62
- Layer rendering: Automatic differentiation between LineString and Point geometries
- Point layers use `L.circleMarker` with custom styling
- Line layers use dashed patterns for distinction

## Performance Notes

- Large datasets (355MB railroads) may take 5-10 seconds to load
- Layers use client-side rendering (all data loaded into browser)
- Recommend toggling only 1-2 layers at a time for best performance
- Clustering enabled for deal pins to improve performance

## Future Enhancements

### Potential Additional Layers
- **Waterways**: OpenStreetMap rivers/streams (requires regional filtering)
- **Wastewater Plants**: EPA NPDES facilities (API currently unavailable)
- **Census Income**: Choropleth map of median household income by tract (requires geopandas)
- **Flood Zones**: FEMA flood plains
- **Airports**: FAA airport locations
- **Highways**: Interstate and major highways

### Performance Improvements
- Consider vector tiles for very large datasets
- Add zoom-level filtering to show/hide features at different scales
- Implement server-side rendering for datasets >100MB

## Data Sources & Licensing

- **HIFLD**: Public domain, US Government work
- **BTS/NTAD**: Public domain, US Department of Transportation
- **Starbucks**: Compiled from public sources, educational use
- **Census**: Public domain, US Census Bureau

All datasets are used for educational and business intelligence purposes.

## Updates

Last updated: October 2025
Next recommended update: Quarterly (HIFLD/BTS update cycles)
