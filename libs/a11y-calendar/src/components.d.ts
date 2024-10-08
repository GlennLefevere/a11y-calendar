/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface A11yCalendar {
        "locale": string;
        "type": CalendarType;
        "value": CalendarValue;
    }
}
declare global {
    interface HTMLA11yCalendarElement extends Components.A11yCalendar, HTMLStencilElement {
    }
    var HTMLA11yCalendarElement: {
        prototype: HTMLA11yCalendarElement;
        new (): HTMLA11yCalendarElement;
    };
    interface HTMLElementTagNameMap {
        "a11y-calendar": HTMLA11yCalendarElement;
    }
}
declare namespace LocalJSX {
    interface A11yCalendar {
        "locale"?: string;
        "type"?: CalendarType;
        "value"?: CalendarValue;
    }
    interface IntrinsicElements {
        "a11y-calendar": A11yCalendar;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "a11y-calendar": LocalJSX.A11yCalendar & JSXBase.HTMLAttributes<HTMLA11yCalendarElement>;
        }
    }
}
