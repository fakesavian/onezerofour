class WireframeBase {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.points = [];
        this.edges = [];
        this.rotation = { x: 0.5, y: 0, z: 0 };
        this.rotationSpeed = 0;
        this.targetRotation = 0;
        this.momentum = 0;
        
        this.setupCanvas();
        this.animate();
    }

    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('wheel', (e) => {
            this.momentum = e.deltaY * 0.0002;
            this.rotationSpeed += this.momentum;
        });
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    addEdges(baseIndex, connections) {
        for (let i = 0; i < connections.length; i += 2) {
            this.edges.push([
                baseIndex + connections[i],
                baseIndex + connections[i + 1]
            ]);
        }
    }

    project(point) {
        const scale = 1.5;
        const perspective = 800;
        
        let x = point.x;
        let y = point.y;
        let z = point.z;
        
        const cosY = Math.cos(this.rotation.y);
        const sinY = Math.sin(this.rotation.y);
        const tempX = x;
        x = x * cosY - z * sinY;
        z = tempX * sinY + z * cosY;
        
        const cosX = Math.cos(this.rotation.x);
        const sinX = Math.sin(this.rotation.x);
        const tempY = y;
        y = y * cosX - z * sinX;
        z = tempY * sinX + z * cosX;
        
        const s = perspective / (perspective + z);
        return {
            x: this.canvas.width/2 + x * s * scale,
            y: this.canvas.height/2 + y * s * scale,
            z: z
        };
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Sort edges by depth for better rendering
        const sortedEdges = this.edges.map(edge => {
            const p1 = this.project(this.points[edge[0]]);
            const p2 = this.project(this.points[edge[1]]);
            const avgZ = (p1.z + p2.z) / 2;
            return { edge, avgZ, p1, p2 };
        }).sort((a, b) => b.avgZ - a.avgZ);
        
        // Draw edges with depth-based intensity
        sortedEdges.forEach(({ p1, p2, avgZ }) => {
            const intensity = Math.min(1, Math.max(0.3, 1 - avgZ/1000));
            this.ctx.strokeStyle = `rgba(0, 255, 0, ${intensity})`;
            this.ctx.lineWidth = Math.max(1, 2 - avgZ/500);
            
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
        });
    }

    animate() {
        // Apply momentum and friction
        this.rotationSpeed += this.momentum;
        this.momentum *= 0.95;
        this.rotationSpeed *= 0.95;
        
        this.rotation.y += this.rotationSpeed;
        
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}
