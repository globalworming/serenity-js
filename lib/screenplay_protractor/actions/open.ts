import {Action, PerformsTasks} from '../../screenplay/pattern';
import {step} from '../../screenplay/recording/annotations';

export class Open implements Action {

    static browserOn(website: string) : Open {
        return new Open(website);
    }

    @step("{0} opens the #targetWebsite")
    performAs(actor: PerformsTasks) {
        browser.get(this.targetWebsite)
    }

    constructor(private targetWebsite: string) { }
}