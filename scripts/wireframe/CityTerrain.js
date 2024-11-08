class CityTerrain extends WireframeBase {
    createTerrain() {
        this.points = [];
        this.edges = [];
        
        // Create main buildings in a more complex arrangement
        const buildingPositions = [
            {x: -90, scale: 1.2}, {x: -60, scale: 0.8}, 
            {x: -30, scale: 1.5}, {x: 0, scale: 1.3},
            {x: 30, scale: 1}, {x: 60, scale: 1.4},
            {x: 90, scale: 0.9}
        ];
        
        buildingPositions.forEach(pos => {
            const height = (40 + Math.random() * 80) * pos.scale;
            const width = (15 + Math.random() * 10) * Math.sqrt(pos.scale);
            this.createDetailedBuilding(pos.x, height, width);
            
            // Add architectural details
            if (Math.random() > 0.4) {
                this.createAntenna(pos.x, -height, width/2);
            }
            if (Math.random() > 0.6) {
                this.createSpire(pos.x, -height, width/3);
            }
            if (Math.random() > 0.7) {
                this.createTechDetails(pos.x, -height * 0.7, width);
            }
        });
        
        // Add connecting structures
        for (let i = 0; i < buildingPositions.length - 1; i++) {
            if (Math.random() > 0.6) {
                const x1 = buildingPositions[i].x;
                const x2 = buildingPositions[i + 1].x;
                const height = 40 + Math.random() * 40;
                this.createSkybridge(x1, x2, -height);
            }
        }
    }

    createDetailedBuilding(x, height, width) {
        const baseIndex = this.points.length;
        const levels = Math.floor(height / 15);
        const depth = width;
        
        // Create main structure with setbacks
        for (let level = 0; level <= levels; level++) {
            const y = -(height * level / levels);
            const setback = Math.pow(level / levels, 2) * 0.3; // Exponential setback
            const levelWidth = width * (1 - setback);
            const levelDepth = depth * (1 - setback);
            
            // Add points for this level
            this.points.push(
                {x: x - levelWidth, y: y, z: -levelDepth},
                {x: x + levelWidth, y: y, z: -levelDepth},
                {x: x + levelWidth, y: y, z: levelDepth},
                {x: x - levelWidth, y: y, z: levelDepth}
            );
            
            // Connect to level below
            if (level > 0) {
                const base = baseIndex + (level - 1) * 4;
                this.addEdges(base, [0,4, 1,5, 2,6, 3,7]);
                this.addEdges(base + 4, [0,1, 1,2, 2,3, 3,0]);
            }
            
            // Add floor details
            if (level < levels) {
                this.createFloorDetail(x, y, levelWidth, levelDepth);
            }
        }
    }

    createFloorDetail(x, y, width, depth) {
        const baseIndex = this.points.length;
        const segments = 4;
        
        // Create horizontal detail lines
        for (let i = 0; i < segments; i++) {
            const xOffset = (i - segments/2) * (width/segments);
            this.points.push(
                {x: x + xOffset, y: y, z: -depth},
                {x: x + xOffset, y: y - 5, z: -depth}
            );
            this.addEdges(baseIndex + i * 2, [0,1]);
        }
        
        // Create vertical supports
        for (let i = 0; i < 2; i++) {
            const zOffset = (i * 2 - 1) * depth * 0.7;
            this.points.push(
                {x: x - width * 0.7, y: y, z: zOffset},
                {x: x - width * 0.7, y: y - 5, z: zOffset},
                {x: x + width * 0.7, y: y, z: zOffset},
                {x: x + width * 0.7, y: y - 5, z: zOffset}
            );
            const idx = baseIndex + segments * 2 + i * 4;
            this.addEdges(idx, [0,1, 2,3]);
        }
    }

    createAntenna(x, baseY, radius) {
        const baseIndex = this.points.length;
        const height = 30;
        const segments = 4;
        
        // Create main antenna pole
        this.points.push(
            {x: x, y: baseY, z: 0},
            {x: x, y: baseY - height, z: 0}
        );
        this.edges.push([baseIndex, baseIndex + 1]);
        
        // Create antenna arrays at different heights
        for (let i = 0; i < segments; i++) {
            const y = baseY - height * (i + 1) / (segments + 1);
            const r = radius * (1 - i / segments);
            
            // Create cross beams
            this.points.push(
                {x: x - r, y: y, z: 0},
                {x: x + r, y: y, z: 0},
                {x: x, y: y, z: -r},
                {x: x, y: y, z: r}
            );
            
            const idx = baseIndex + 2 + i * 4;
            this.addEdges(idx, [0,1, 2,3]);
            
            // Add diagonal supports
            if (i < segments - 1) {
                this.edges.push(
                    [idx, idx + 4],
                    [idx + 1, idx + 5],
                    [idx + 2, idx + 6],
                    [idx + 3, idx + 7]
                );
            }
        }
    }

    createTechDetails(x, y, width) {
        const baseIndex = this.points.length;
        const height = width * 0.5;
        
        // Create tech equipment boxes
        for (let i = 0; i < 3; i++) {
            const xOffset = (i - 1) * width * 0.6;
            const boxWidth = width * 0.2;
            const boxHeight = height * (0.5 + Math.random() * 0.5);
            
            this.points.push(
                // Bottom
                {x: x + xOffset - boxWidth, y: y, z: -boxWidth},
                {x: x + xOffset + boxWidth, y: y, z: -boxWidth},
                {x: x + xOffset + boxWidth, y: y, z: boxWidth},
                {x: x + xOffset - boxWidth, y: y, z: boxWidth},
                // Top
                {x: x + xOffset - boxWidth, y: y - boxHeight, z: -boxWidth},
                {x: x + xOffset + boxWidth, y: y - boxHeight, z: -boxWidth},
                {x: x + xOffset + boxWidth, y: y - boxHeight, z: boxWidth},
                {x: x + xOffset - boxWidth, y: y - boxHeight, z: boxWidth}
            );
            
            const idx = baseIndex + i * 8;
            this.addEdges(idx, [
                0,1, 1,2, 2,3, 3,0,  // Bottom
                4,5, 5,6, 6,7, 7,4,  // Top
                0,4, 1,5, 2,6, 3,7   // Verticals
            ]);
            
            // Add pipes and connectors
            if (i < 2) {
                this.points.push(
                    {x: x + xOffset + boxWidth, y: y - boxHeight * 0.3, z: 0},
                    {x: x + xOffset + width * 0.6, y: y - boxHeight * 0.3, z: 0}
                );
                this.edges.push([baseIndex + i * 8 + 8, baseIndex + i * 8 + 9]);
            }
        }
    }

    createSpire(x, baseY, radius) {
        const baseIndex = this.points.length;
        const height = 40;
        const segments = 6;
        
        // Create spiral spire
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 4; // Two full rotations
            const y = baseY - (height * i / segments);
            const r = radius * (1 - i / segments);
            this.points.push(
                {x: x + Math.cos(angle) * r, y: y, z: Math.sin(angle) * r}
            );
            
            if (i > 0) {
                this.edges.push([baseIndex + i - 1, baseIndex + i]);
            }
        }
        
        // Add cross supports
        for (let i = 0; i < segments - 2; i += 2) {
            this.edges.push([baseIndex + i, baseIndex + i + 2]);
        }
    }

    createSkybridge(x1, x2, y) {
        const baseIndex = this.points.length;
        const height = 15;
        const width = 5;
        const segments = 4;
        
        // Create bridge segments
        for (let i = 0; i <= segments; i++) {
            const x = x1 + (x2 - x1) * (i / segments);
            const yOffset = Math.sin(i / segments * Math.PI) * 10; // Arch effect
            
            this.points.push(
                {x: x, y: y + yOffset, z: width},
                {x: x, y: y + yOffset, z: -width},
                {x: x, y: y + yOffset - height, z: width},
                {x: x, y: y + yOffset - height, z: -width}
            );
            
            if (i > 0) {
                const idx = baseIndex + (i - 1) * 4;
                this.addEdges(idx, [0,4, 1,5, 2,6, 3,7]);
                this.addEdges(idx, [0,1, 1,3, 3,2, 2,0]);
            }
        }
        
        // Add support cables
        const midX = (x1 + x2) / 2;
        this.points.push(
            {x: midX, y: y - height * 2, z: 0},
            {x: x1 + (x2 - x1) * 0.25, y: y, z: 0},
            {x: x1 + (x2 - x1) * 0.75, y: y, z: 0}
        );
        
        const supportIdx = baseIndex + segments * 4;
        this.edges.push(
            [supportIdx, supportIdx + 1],
            [supportIdx, supportIdx + 2]
        );
    }
}
