import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WebAudioHelperService } from '../../services/webaudio-helper.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'durrr',
    templateUrl: 'durrr.component.html'
})
export class DurrrComponent implements OnInit {
    @ViewChild("visualiser") visuliser: ElementRef;
    public canvasElem: any;
    public canvasCtx: any;
    public WIDTH: number;
    public HEIGHT: number;
    public webAudioSourceChangeSubscription: Subscription;
    public animationId: any; 

    constructor(public webAudioHelper: WebAudioHelperService) {
        this.webAudioSourceChangeSubscription = new Subscription();
    }

    ngOnInit() {
        this.canvasElem = this.visuliser.nativeElement;
        this.WIDTH = this.canvasElem.clientWidth;
        this.HEIGHT = this.canvasElem.clientHeight;
        this.canvasCtx = this.canvasElem.getContext('2d');
        this.webAudioSourceChangeSubscription = this.webAudioHelper.sourceStatusChanged$.subscribe(status=> {
            if(status) {
                this.WIDTH = this.canvasElem.getBoundingClientRect().width;
                this.HEIGHT = this.canvasElem.getBoundingClientRect().height;
                this.canvasElem.width = this.WIDTH;
                this.canvasElem.height = this.HEIGHT;
                this.draw();
            } else {
                cancelAnimationFrame(this.animationId);
            }
        });
    }
    
    public drawTest = () => {
        this.animationId = requestAnimationFrame(this.drawTest);
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(0,0);
        this.canvasCtx.lineTo(this.WIDTH,this.HEIGHT);
        this.canvasCtx.stroke();
    }
    public draw = () => {
        
        this.animationId = requestAnimationFrame(this.draw);
        this.webAudioHelper.setFrequencyData();
        this.webAudioHelper.setTimeDomainData();
        this.canvasCtx.fillStyle = '#3D3D3D';
        this.canvasCtx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.strokeStyle = '#E84C3D';

        this.canvasCtx.beginPath();

        var sliceWidth = this.WIDTH * 1.0 / WebAudioHelperService.analyserBufferLength;
        var x = 0;

        for (var i = 0; i < WebAudioHelperService.analyserBufferLength; i++) {

            var v = WebAudioHelperService.analyserTimeDomainData[i] / 128.0;
            var y = v * this.HEIGHT / 2;

            if (i === 0) {
                this.canvasCtx.moveTo(x, y);
            } else {
                this.canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        this.canvasCtx.lineTo(this.WIDTH, this.HEIGHT/2 );
        this.canvasCtx.stroke();
    }
}