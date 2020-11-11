<template>
    <div class="relative">
        <div class="absolute top-0 w-full p-4 flex items-center justify-between z-10">
            <button @click="stage.scale({ x: 0.5, y: 0.5 }); stage.batchDraw();">
                Left
            </button>
            <button @click="stage.scale({ x: 1, y: 1 }); stage.batchDraw();">
                Right
            </button>
        </div>
        <div
            v-once
            id="container"
        />
        <div class="absolute bottom-0 w-full p-4 flex items-center justify-between z-10">
            <div>
                <div
                    v-for="(value, index) in debugValues"
                    :key="index"
                >
                    {{ value }}
                </div>
            </div>

            <div>
                <div>{{ wheel.dx }} - {{ wheel.dy }}</div>
                
                <div>{{ x }} - {{ y }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Konva from 'konva';

interface GridChunkOptions {
    width: number;
    height: number;
    blockSize: number;
    x: number;
    y: number;
}

class GridChunk {
    private group: Konva.Group = new Konva.Group();

    private width: number;
    private height: number;
    private blockSize: number;

    public x: number;
    public y: number;

    public constructor(options: GridChunkOptions) {
        this.width = options.width;
        this.height = options.height;
        this.blockSize = options.blockSize;

        this.x = options.x;
        this.y = options.y;
    }
    
    public build(): Konva.Group {

        const normalizedWidth = Math.ceil(this.width / this.blockSize) * this.blockSize;
        const normalizedHeight = Math.ceil(this.height / this.blockSize) * this.blockSize;

        for (var i = 0; i < normalizedWidth / this.blockSize; i++) {
            const line = new Konva.Line({
                points: [0, 0, 0, normalizedHeight],
                stroke: '#eee',
                strokeWidth: 1,
                x: this.x * normalizedWidth + Math.round(i * this.blockSize),
                y: this.y * normalizedHeight 
            });

            this.group.add(line);
        }

        for (var j = 0; j < normalizedHeight / this.blockSize; j++) {
            const line = new Konva.Line({
                points: [0, 0, normalizedWidth, 0],
                stroke: '#eee',
                strokeWidth: 1,
                x: this.x * normalizedWidth ,
                y: this.y * normalizedHeight + Math.round(j * this.blockSize),
            })
    
            this.group.add(line);
        }

        return this.group;
    }
}


export default Vue.extend({
    data() {
        return {
            debugValues: [],
            stage: null,
            rectangle: null,
            x: 0,
            y: 0,
            wheel: {
                dx: 0,
                dy: 0
            },
            configKonva: {
                width: window.innerWidth,
                height: window.innerHeight
            },
        };
    },

    mounted() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var blockSize = 30;

        const stage = new Konva.Stage({
            container: 'container',
            width: window.innerWidth,
            height: window.innerHeight,
            draggable: true
        });

        stage.on('dragmove', () => {
            const x = stage.x();
            const y = stage.y();

            this.$data.x = x;
            this.$data.y = y;

            this.wheel.dx = x ? x > 0 ? Math.ceil(stage.x() / width) : Math.ceil(stage.x() / width) : 0;
            this.wheel.dy = y ? y > 0 ? Math.ceil(stage.y() / height) : Math.ceil(stage.y() / height) : 0;
        });

        this.$data.stage = stage;

        function newRectangle(x: number, y: number, stage: Konva.Stage): Konva.Rect {
            let rectangle = new Konva.Rect({
                x: x,
                y: y,
                width: blockSize * 6,
                height: blockSize * 3,
                fill: '#fff',
                stroke: '#999',
                strokeWidth: 1,
                draggable: true,
            });

            rectangle.on('dragend', () => {
                rectangle.position({
                    x: Math.round(rectangle.x() / blockSize) * blockSize,
                    y: Math.round(rectangle.y() / blockSize) * blockSize
                });
                stage.batchDraw();
            });

            return rectangle;
        }

        var layer = new Konva.Layer();
        var gridLayer = new Konva.Layer();

        const gridChuncks: GridChunk[] = [];

        gridChuncks.push(new GridChunk({ width, height, blockSize, x: 0, y: 0 }));

        gridChuncks.push(new GridChunk({ width, height, blockSize, x: -1, y: 0 }));
        gridChuncks.push(new GridChunk({ width, height, blockSize, x: -1, y: -1 }));
        gridChuncks.push(new GridChunk({ width, height, blockSize, x: 0, y: -1 }));

        gridChuncks.push(new GridChunk({ width, height, blockSize, x: 1, y: 0 }));
        gridChuncks.push(new GridChunk({ width, height, blockSize, x: 1, y: 1 }));
        gridChuncks.push(new GridChunk({ width, height, blockSize, x: 0, y: 1 }));

        gridChuncks.push(new GridChunk({ width, height, blockSize, x: -1, y: 1 }));
        gridChuncks.push(new GridChunk({ width, height, blockSize, x: 1, y: -1 }));
        
        gridLayer.add(...gridChuncks.map((c) => c.build()));

        layer.add(newRectangle(blockSize * 3, blockSize * 3, stage));
        layer.add(newRectangle(blockSize * 10, blockSize * 10, stage))
        layer.add(newRectangle(blockSize * 15, blockSize * 6, stage));

        stage.add(gridLayer);
        stage.add(layer);

        stage.on('dragend', () => {
            layer.draw();
        })
    }
});
</script>
