import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "toDate",
  pure: false
})
export class ToDatePipe implements PipeTransform {
  transform(timestamp: any): any {
    return timestamp.toDate();
  }
}
