import { FooterComponent } from './shared/footer/footer.component';
import { LastSyncComponent } from './shared/last-sync/last-sync.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [LastSyncComponent,FooterComponent],
  exports:      [LastSyncComponent,FooterComponent]
})
export class SharedModule { }
