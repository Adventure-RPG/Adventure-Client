import {Component, OnInit } from '@angular/core';

@Component({
  selector: 'adventure-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor() { }

  // constant for swipe action: left or right
  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };

  public applications = [
    {
      baseClass: 'a'
    },
    {
      baseClass: 'b'
    },
    {
      baseClass: 'c'
    },
    {
      baseClass: 'd'
    },
    {
      baseClass: 'e'
    },
    {
      baseClass: 'f'
    }
  ]

  public currentIndex: number = 0;
  public nextIndex: number = 0;
  public rotatteDegString;

  // action triggered when user swipes
  swipe(action = this.SWIPE_ACTION.RIGHT) {
    console.log(this.currentIndex);
    console.log(action);
    // // out of range
    // if (this.currentIndex > this.avatars.length || this.currentIndex < 0) return;

    // swipe right, next avatar
    if (action === this.SWIPE_ACTION.RIGHT) {
      const isLast = this.currentIndex === this.applications.length - 1;
      this.nextIndex = isLast ? 0 : this.currentIndex + 1;
    }

    // swipe left, previous avatar
    if (action === this.SWIPE_ACTION.LEFT) {
      const isFirst = this.currentIndex === 0;
      this.nextIndex = isFirst ? this.applications.length - 1 : this.currentIndex - 1;
    }

    console.log(`${this.currentIndex} -> ${this.nextIndex}`)
    this.currentIndex = this.nextIndex;
    // this.avatars.forEach((x, i) => x.visible = (i === nextIndex));
  }

  ngOnInit() {
  }

}
