/**
 * Playwright E2E Framework - Types and Interfaces
 * 
 * This file contains all the TypeScript types and interfaces used by the framework.
 * Customize these types based on your project's domain entities.
 */

/**
 * HTML Element Types enum for element classification
 */
export enum HTMLElementType {
  Button = "button",
  Input = "input",
  Image = "image",
  Icon = "icon",
  Link = "link",
  ComboBox = "combobox",
  CheckBox = "checkbox",
  Container = "container",
  Card = "card",
  DatePicker = "datepicker",
  DropDown = "dropdown",
  ListBox = "listbox",
  Menu = "menu",
  MenuItem = "menuitem",
  RadioButton = "radiobutton",
  Tab = "tab",
  Table = "table",
  TextField = "textfield",
  TimePicker = "timepicker",
  ToggleButton = "togglebutton",
  Tree = "tree",
  TreeItem = "treeitem",
  Window = "window",
  ProgressBar = "progressbar",
  Label = "label",
  Heading = "heading",
  Paragraph = "paragraph",
  List = "list",
  ListItem = "listitem",
  TableRow = "tablerow",
  TableCell = "tablecell",
  TableHeader = "tableheader",
  TableFooter = "tablefooter",
  TableHeaderCell = "tableheadercell",
  TableBody = "tablebody",
  TableHeaderRow = "tableheaderrow",
  Div = "div",
  Section = "Section",
  Modal = "Modal",
  Badge = "Badge",
  Checkbox = "Checkbox",
  DropDownItem = "DropDownItem",
  Switch = "Switch",
}

/**
 * WebElement interface for defining page elements
 */
export interface IWebElement {
  selector: string;
  identifier: string;
  imageName?: string;
  internalText?: string;
  elementType?: HTMLElementType;
  properties?: string[];
  propertiesList?: IWebElementProperties[];
}

/**
 * WebElement properties interface for CSS/attribute assertions
 */
export interface IWebElementProperties {
  propertyName: string;
  propertyValues: string;
}

/**
 * Card data interface for gallery/list views
 */
export interface CardData {
  cardTitle: string;
  cardDescription?: string;
  cardStatus?: string;
  cardCustomFieldOne?: string;
  cardCustomFieldTwo?: string;
  cardCustomFieldThree?: string;
  cardCustomFieldFour?: string;
  cardCustomFieldFive?: string;
  cardCustomFieldSix?: string;
  cardCustomFieldSeven?: string;
  cardCustomFieldEight?: string;
  cardCustomFieldNine?: string;
  cardCustomFieldTen?: string;
  cardType?: any;
}

/**
 * Browser Configuration Interface
 */
export interface BrowserConfig {
  browserName?: "chromium" | "firefox" | "webkit" | "chrome";
  headless?: boolean;
  viewport?: { width: number; height: number };
  video?: boolean;
  trace?: boolean;
  videoDir?: string;
  traceDir?: string;
}

/**
 * Browser Information Interface
 */
export interface BrowserInfo {
  name: string;
  version: string;
  viewport: { width: number; height: number };
  headless: boolean;
}

/**
 * Assertion Result interface for test reporting
 */
export interface AssertionResult {
  elementIdentifier: string;
  assertionType: string;
  status: "PASSED" | "FAILED" | "SKIPPED" | "INFO" | "WARNING" | "STEP";
  message: string;
  timestamp: string;
  selector?: string;
  expectedValue?: string;
  actualValue?: string;
  screenshotPath?: string;
  duration?: number;
}

/**
 * Assertion Summary interface for test reporting
 */
export interface AssertionSummary {
  totalAssertions: number;
  passed: number;
  failed: number;
  skipped: number;
  startTime: string;
  endTime: string;
  duration: number;
  results: AssertionResult[];
}

// ============================================================
// DOMAIN-SPECIFIC TYPES (Customize for your project)
// ============================================================

/**
 * Example: Generic Entity interface
 * Replace with your own domain entities
 */
export interface GenericEntity {
  id?: string;
  name: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Example: Form field criteria interface
 */
export interface Criteria {
  fieldName: string;
  operatorName: string;
  valueName: string;
}



export enum Wheater {
    RAINING = "Raining",
    SNOWING = "Snowing",
    SUNNY = "Sunny",
    CLOUDY = "Cloudy",
    CLEAR = "Clear",
    COLD = "Cold",
    HOT = "Hot",
    MILD = "Mild"
}

export type Activity = {
    activityName: string;
    activitySuitability: number;
    activityReason: string;
};

export type forecastDays = {
    date: string;
    activities: Activity[];
};

export type CityActivity = {
    name: string;
    currentDate: string;
    forecastDays: forecastDays[];
};

export type ScoreAndReason = {
    activitySuitability: number;
    reason: string;
};

export type CityNotFoundError = {
    error: string;
};
