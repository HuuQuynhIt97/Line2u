import { SystemLanguageService } from "../_service/system-language.service";

export function languagesInitializer(service: SystemLanguageService) {
    return () =>
      new Promise((resolve, reject) => {
              service.getLanguages(localStorage.getItem('lang') || 'tw').subscribe(data => {
                localStorage.setItem('languages', JSON.stringify(data));
              }).add(resolve);

        });
}
