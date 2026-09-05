export class WebHelper {

  public static getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  public static getSumDate(date: string, days: number): string {
    const dateObject = new Date(date);
    dateObject.setDate(dateObject.getDate() + days);
    return dateObject.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  public static assert(
    condition: boolean,
    successMessage: string = "Assertion Success!",
    failMessage: string = "Assertion Error!"
  ) {
    condition == true 
      ? console.log(successMessage)
      : console.log(failMessage);
  }
}