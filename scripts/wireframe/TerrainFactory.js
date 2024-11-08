class TerrainFactory {
    static create(type, canvas) {
        let terrain;
        
        switch (type) {
            case 'mountain':
                terrain = new MountainTerrain(canvas);
                break;
            case 'cityscape':
                terrain = new CityTerrain(canvas);
                break;
            case 'forest':
                terrain = new ForestTerrain(canvas);
                break;
            case 'ocean':
                terrain = new OceanTerrain(canvas);
                break;
            default:
                throw new Error(`Unknown terrain type: ${type}`);
        }
        
        terrain.createTerrain();
        return terrain;
    }
}
