"use strict";

class Chart {
    constructor(N, numberOfTrajectories, attacks, yFunc, calculationPoint, numberOfBuckets) {
        this.subIntervals = attacks;
        this.n = N * this.subIntervals;
        this.numberOfTrajectories = numberOfTrajectories;
        this.coordinates = [];
        this.aggregatedCoordinates = [];
        this.values = Array(this.numberOfTrajectories).fill().map(() => Array(this.n).fill(0));
        this.aggregatedValues = Array(this.n).fill(0);
        this.YFunc = yFunc;
        this.trajectoriesColor = Array(this.numberOfTrajectories).fill(0);

        this.aggregatedTrajectoryColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        this.maxValue = Number.MIN_VALUE;
        this.minValue = Number.MAX_VALUE;
        this.maxAggregatedValue = Number.MIN_VALUE;
        this.minAggregatedValue = Number.MAX_VALUE;

        this.Simulate();

        this.endValuesHistogram = new Histogram(this.n - 1, this.numberOfTrajectories, this.n, this.values, numberOfBuckets, null);
        this.midValuesHistogram = new Histogram(calculationPoint, this.numberOfTrajectories, this.n, this.values, numberOfBuckets, null);
    }

   
    Simulate() {
        for (let k = 0; k < this.numberOfTrajectories; k++) {
            let points = Array(this.n).fill(new Point(0, 0));
            
            for (let i = 0; i < this.n; i++) {
                this.values[k][i] = this.YFunc(this.values, k, i);
                points[i] = new Point(i, this.values[k][i]);
    
                if (this.values[k][i] > this.maxValue) {
                    this.maxValue = this.values[k][i];
                } else if (this.values[k][i] < this.minValue) {
                    this.minValue = this.values[k][i];
                }
            }
            this.coordinates.push(points);
            this.trajectoriesColor[k] = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        }
        
        for(let i = 0; i < this.n; i++) {
            this.aggregatedValues[i] = 0;
    
            let point = new Point(i, 0);
    
            for(let k = 0; k < this.numberOfTrajectories; k++) {
                let tmp = (this.aggregatedValues[i] += this.values[k][i]);
                
                if(tmp > this.maxAggregatedValue) {
                    this.maxAggregatedValue = tmp;
                } else if (tmp < this.minAggregatedValue) {
                    this.minAggregatedValue = tmp;
                }
            }
    
            point.y = this.aggregatedValues[i];
            this.aggregatedCoordinates.push(point);
        }
    }    
}
