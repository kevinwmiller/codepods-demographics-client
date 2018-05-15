
const lengthOfLatitudeDegreeAtEquator = 69.172;

function convertToRadians(degreeValue) {
    return (degreeValue * Math.PI) / 180;
}

/**
 * Calculates the corresponding cell. TEST ME
 *
 * @param      {<type>}  location     The latitude and longitude of the data point
 * @param      {<type>}  cellSize  The cell size
 * @param      {<type>}  bounds    The bounds
 * @return     {Array}   The corresponding cell.
 */
function calculateCorrespondingCell(location, cellSize, bounds, gridSize) {
    const topLeftCoordinates = {
        latitude: bounds.getNorthEast().lat(),
        longitude: bounds.getSouthWest().lng(),
    };
    const distanceFromTopLeft = {
        // Absolute value since latitude of the data point will be smaller than the latitude of the top left corner
        height: Math.abs(location.latitude - topLeftCoordinates.latitude),
        width: Math.abs(location.longitude - topLeftCoordinates.longitude),
    };
    let cell = [
        Math.floor(distanceFromTopLeft.height / cellSize.height),
        Math.floor(distanceFromTopLeft.width / cellSize.width),
    ];
    // Doing this to fix any precision errors that are occurring during division.
    // These error sometimes push the quotient over the "cell boundary" into an invalid cell
    if (cell[0] >= gridSize.height) {
        cell[0] = gridSize.height - 1;
    }
    if (cell[1] >= gridSize.width) {
        cell[1] = gridSize.width - 1;
    }
    return cell;
}


function buildGrid(map, squareMilesPerCell = 1) {
    const bounds = map.getBounds()
    const viewportSize = {
        height: bounds.getNorthEast().lat() - bounds.getSouthWest().lat(),
        width: bounds.getNorthEast().lng() - bounds.getSouthWest().lng(),
    };
    // Length of longitude varies depending on your latitude
    // 1° longitude = cosine (latitude) * length of degree (miles) at equator
    const lengthOfLongitudeMile = Math.abs(Math.cos(convertToRadians(bounds.getNorthEast().lat())) * lengthOfLatitudeDegreeAtEquator);
    // 1 degree of latitude is approximately 69 miles
    // 0.072463781159 degrees of latitude is approximately 5 miles
    const fiveMilesInLatitudeDegrees = squareMilesPerCell / lengthOfLatitudeDegreeAtEquator;
    const fiveMilesInLongitudeDegrees = squareMilesPerCell / lengthOfLongitudeMile;
    const gridSize = {
        height: Math.ceil(viewportSize.height / fiveMilesInLatitudeDegrees),
        width: Math.ceil(viewportSize.width / fiveMilesInLongitudeDegrees)
    };
    const cellSize = {
        height: viewportSize.height / gridSize.height,
        width: viewportSize.width / gridSize.width,
    }
    // Create a grid with an empty list in each cell
    let grid = Array(gridSize.height).fill().map(() => {
        return Array(gridSize.width).fill().map(() => {
            return {
                cellCenterCoordinates: {
                    latitude: 0,
                    longitude: 0,
                },
                cellData: [],
            };
        });
    });

    // Set center coordinates of each cell. Can probably do this in a cleaner way, but this works for now
    for (let row of grid.keys()) {
        for (let column of grid[row].keys()) {
            grid[row][column].cellCenterCoordinates = {
                latitude: bounds.getNorthEast().lat() - (row * cellSize.height + (cellSize.height / 2)),
                longitude: column * cellSize.width + (cellSize.width / 2) + bounds.getSouthWest().lng(),
            }
        }
    }
    return {
        metaData: {
            gridSize,
            cellSize,
        },
        grid,
    };
}

module.exports = {
    buildGrid,
    calculateCorrespondingCell,
};