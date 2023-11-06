import { options, string } from 'yargs';
import { Context } from '../Context';
import { ContainerElement, RenderElement, RenderOptions } from '../Element';
import { Token } from '../Token';
import { ParagraphElement } from './ParagraphElement';
import { BookmarkElement } from './BookmarkElement';
import { DetailsSummaryElement } from './DetailsSummaryElement';

export class DetailsElement implements ContainerElement {
  name: 'details' = 'details';
  paragraph: ParagraphElement = new ParagraphElement();
  isInline: boolean = false;
  textAlign: string = 'center'; 

  constructor() {}

  isEmpty(): boolean {
    return !this.paragraph.getText();
  }

  getText(): string {
    return this.paragraph.getText();
  }

  normalise() {
    this.paragraph.normalise();
  }

  enter(context: Context, initiator: Token): void {
    let align = context.get('par-align');
    if (context) {
      let textAlign = context.get('par-align');
      if (textAlign && /^(left|center|centre|right|justify)$/.test(textAlign)) {
        this.textAlign = textAlign.replace('centre', 'center');
      }
    }
  }

  event(arg: string, context: Context, initiator: Token) {
    switch(arg){
      case 'par':
        return true;
    }
    context.throw('UNKNOWN_EVENT', initiator, arg);
    return false;
  }

  render(options?: RenderOptions): HTMLElement[] {
    let div = document.createElement('div');
    div.classList.add('p');
    div.style.textAlign = this.textAlign;
    div.classList.add('btex-output');



    let details = document.createElement('details');
    div.append(details);

    details.classList.add('btex-details');
    var summaryChild: DetailsSummaryElement | undefined = undefined;
    var newChildren: RenderElement[] = [];
    for (let child of this.paragraph.children)
    {
      if (child instanceof DetailsSummaryElement)
      {
        summaryChild = child;
      }
      else 
      {
        newChildren.push(child);
      }
    }
    // always place summary at the begining if any
    if(summaryChild)
      newChildren.unshift(summaryChild);
    this.paragraph.children = newChildren;
    details.append(...this.paragraph.renderInner(options));
    return [div]
  }
}
