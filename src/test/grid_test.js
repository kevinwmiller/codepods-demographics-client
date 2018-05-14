const chai = require('chai');
const expect = chai.expect;

const buildGrid =  require('../map/grid').buildGrid;
const calculateCorrespondingCell = require('../map/grid').calculateCorrespondingCell;

function convertLatitudeToMiles(latitude) {
    return latitude * 69
}

// Map is 10 miles x 10 miles
const map = {
    getBounds: () => {
        return {
            getNorthEast: () => {
                return {
                    lat: () => {
                        return 0.144;
                    },
                    lng: () => {
                        return 0.144;
                    }
                }
            },
            getSouthWest: () => {
                return {
                    lat: () => {
                        return 0;
                    },
                    lng: () => {
                        return 0;
                    }
                }
            }
        }
    }
}
const squareMilesPerCell = 2;

describe('Grid Calculations', () => {
    it('should build a 5 x 5 grid', () => {
        const gridInfo = buildGrid(map, squareMilesPerCell);

        // Check length
        expect(gridInfo.metaData.gridSize).to.have.all.keys('height', 'width');
        expect(gridInfo.grid).to.have.length(5);
        expect(gridInfo.grid[0]).to.have.length(5);
        expect(gridInfo.grid[1]).to.have.length(5);
        expect(gridInfo.grid[2]).to.have.length(5);
        expect(gridInfo.grid[3]).to.have.length(5);
        expect(gridInfo.grid[4]).to.have.length(5);

        // Each cell should be approximately squareMilesPerCell miles in width and height
        expect(Math.round(convertLatitudeToMiles(gridInfo.metaData.cellSize.width))).to.equal(squareMilesPerCell);
        expect(Math.round(convertLatitudeToMiles(gridInfo.metaData.cellSize.height))).to.equal(squareMilesPerCell);
    });

    it('should calculate the correct cell for the given data point', () => {
        const gridInfo = buildGrid(map, squareMilesPerCell);
        const bottomLeftGridCell = calculateCorrespondingCell({
            latitude: gridInfo.metaData.cellSize.height / 2,
            longitude: gridInfo.metaData.cellSize.width / 2,
        }, gridInfo.metaData.cellSize, map.getBounds(), gridInfo.metaData.gridSize);

        expect(bottomLeftGridCell[0]).to.equal(gridInfo.metaData.gridSize.height - 1);
        expect(bottomLeftGridCell[1]).to.equal(0);

        const outsideMapGridCell = calculateCorrespondingCell({
            latitude: 100000,
            longitude: 100000,
        }, gridInfo.metaData.cellSize, map.getBounds(), gridInfo.metaData.gridSize);

        // Points outside map should snap to the borders of the map
        expect(outsideMapGridCell[0]).to.equal(gridInfo.metaData.gridSize.height - 1);
        expect(outsideMapGridCell[1]).to.equal(gridInfo.metaData.gridSize.width - 1);
    });
});
