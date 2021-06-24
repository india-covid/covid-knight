import { animation, style, animate, trigger, transition, useAnimation } from '@angular/animations';

export const enterAnimationLeft = animation([
  style({ transform: 'translateX(-100%)', opacity: 0 }),
  animate('{{time}}', style({ transform: 'translateX(0)', opacity: 1 }))
]);



export const enterAnimationRight = animation([
  style({ transform: 'translateX(100%)', opacity: 0 }),
  animate('150ms', style({ transform: 'translateX(0)', opacity: 1 }))
]);
