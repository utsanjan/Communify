import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "substring",
  pure: false
})
export class SubstringPipe implements PipeTransform {
  transform(text: string, count: number, location: boolean): any {
    if (text.length > count && location) {
      return text.substring(0, count) + "...";
    }
    return text;
  }
}
