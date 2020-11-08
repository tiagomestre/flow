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
                {{ wheel.dx }} - {{ wheel.dy }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Konva from 'konva';

export default Vue.extend({
    data() {
        return {
            debugValues: [],
            stage: null,
            rectangle: null,
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

        function drawGrid(width: number, height: number, blockSize: number, x: number, y: number): Konva.Line[] {
        
            const lines: Konva.Line[] = [];
            const normalizedWidth = Math.ceil(width / blockSize) * blockSize;
            const normalizedHeight = Math.ceil(height / blockSize) * blockSize;

            for (var i = 0; i < normalizedWidth / blockSize; i++) {
                const line = new Konva.Line({
                    points: [0, 0, 0, normalizedHeight],
                    stroke: '#ddd',
                    strokeWidth: 1,
                    x: x * normalizedWidth + Math.round(i * blockSize),
                    y: y * normalizedHeight 
                });

                lines.push(line);
            }

            for (var j = 0; j < normalizedHeight / blockSize; j++) {
                const line = new Konva.Line({
                    points: [0, 0, normalizedWidth, 0],
                    stroke: '#ddd',
                    strokeWidth: 1,
                    x: x * normalizedWidth ,
                    y: y * normalizedHeight + Math.round(j * blockSize),
                })
    
                lines.push(line);
            }

            return lines;
        }

        gridLayer.add(...drawGrid(width, height, blockSize, 0, 0));

        gridLayer.add(...drawGrid(width, height, blockSize, -1, 0));
        gridLayer.add(...drawGrid(width, height, blockSize, -1, -1));
        gridLayer.add(...drawGrid(width, height, blockSize, 0, -1));

        gridLayer.add(...drawGrid(width, height, blockSize, 1, 0));
        gridLayer.add(...drawGrid(width, height, blockSize, 1, 1));
        gridLayer.add(...drawGrid(width, height, blockSize, 0, 1));

        gridLayer.add(...drawGrid(width, height, blockSize, -1, 1));
        gridLayer.add(...drawGrid(width, height, blockSize, 1, -1));
        
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
