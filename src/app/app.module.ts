import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OverworldComponent } from './components/overworld/overworld.component';
import { OverworldMapComponent } from './components/overworld-map/overworld-map.component';

@NgModule({
  declarations: [
    AppComponent,
    OverworldComponent,
    OverworldMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
