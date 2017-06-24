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
      baseClass: 'a',
      style: {
        image: 'assets/images/main/adventure.jpg',
        color: '#2d132e'
      },
      content: {
        title: 'Приключение',
        subtitle: 'Начать!'
      }
    },
    {
      baseClass: 'b',
      style: {
        image: 'assets/images/main/inventory.jpg',
        color: '#2d132e'
      },
      content: {
        title: 'Инвентарь',
        subtitle: 'Экипировка и личные вещи'
      },
      routerLink: ['/', { outlets: {popup: ['inventory']}}]
    },
    {
      baseClass: 'c',
      style: {
        image: 'assets/images/main/skills.svg',
        color: '#2d132e',
        backgroundColor: '#66B4C6'
      },
      content: {
        title: 'Персонаж',
        subtitle: 'Характеристики, навыки, умения'
      }
    },
    {
      baseClass: 'd',
      style: {
        image: 'assets/images/main/editor.svg',
        color: '#fff'
      },
      content: {
        title: 'Редактор',
        subtitle: 'Здесь вы можете создать своё приключение!'
      }
    },
    {
      baseClass: 'e',
      style: {
        image: 'assets/images/main/adventure.jpg',
        color: '#2d132e'
      },
      content: {
        title: 'Личный профайл',
        subtitle: ''
      }
    },
    {
      baseClass: 'd',
      style: {
        image: 'assets/images/main/tavern.jpg',
        color: '#2d132e'
      },
      content: {
        title: 'Таверна',
        subtitle: 'Здесь можно найти группу, для приключений'
      }
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
