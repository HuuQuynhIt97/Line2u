import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { Subscription } from "rxjs";
import { formatDate } from '@angular/common';

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
declare global {
  interface Array<T> {
    unsubscribeAll();
    distinctBy(key);
    contains(key, value);
  }

}
Array.prototype.unsubscribeAll = function () {
  return this.forEach((x) => x?.unsubscribe());
};
Array.prototype.distinctBy = function (key) {
  const unique = this.filter(
    (value, index, self) => self.findIndex((m) => m[key] === value[key]) === index,
  );
  return unique;
};
Array.prototype.contains = function(key, value) {
  var i = this.length;
  while (i--) {
      if (this[i][key] === value) {
          return true;
      }
  }
  return false;
}
