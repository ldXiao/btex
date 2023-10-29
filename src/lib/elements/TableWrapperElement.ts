import { option } from 'yargs';
import { Context } from '../Context';
import { ContainerElement, RenderElement, RenderOptions } from '../Element';
import { Token } from '../Token';
import { CaptionElement } from './CaptionElement';
import { ParagraphElement } from './ParagraphElement';
import { TableElement } from './TableElement';
import { BookmarkElement } from './BookmarkElement';

export class TableWrapperElement implements ContainerElement {
  name: 'table_wrapper' = 'table_wrapper';
  paragraph: ParagraphElement = new ParagraphElement();
  isInline: boolean = false;
  isPlain: boolean = false;

  isEmpty(): boolean {
    return false;
  }

  normalise() {
    this.paragraph.normalise();
  }

  enter(context: Context) {
    // do nothing
  }

  exit(context: Context) {
    // do nothing
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
    div.classList.add('table-wrapper');

    var captionChild: CaptionElement | undefined = undefined;
    var tableChild: TableElement | undefined = undefined;
    let tableId = '';
    var newChildren: RenderElement[] = [];

    for (let child of this.paragraph.children)
    {
      if(child instanceof CaptionElement)
      {
        captionChild = child;
        // caption is added to table
      }
      else if(child instanceof TableElement)
      {
        tableChild = child;
        newChildren.push(tableChild);
      }
      else if(child instanceof BookmarkElement && !child.isUnused)
      {
        tableId = (child.prefix ?? '') + (child.id + 1);
        child.isUnused = true;
        div.setAttribute('id', tableId);
      }
      else
      {
        newChildren.push(child);
      }
    }

    if(tableChild){
      if(captionChild)
      {
        tableChild.caption = captionChild;
      }
    }
    else if(captionChild)
    {
      // when no table but with caption
      // create an empty table child to cantain the caption
      let table = new TableElement();
      table.caption = captionChild;
      newChildren.push(table);
    }
    this.paragraph.children = newChildren;
    div.append(...this.paragraph.renderInner(options));
    
    return [div];
  }
}
