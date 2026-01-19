# References
- https://stackoverflow.com/questions/40256891

# Summary

- Child component:
```ts
import { Component, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'child',
  templateUrl: 'child.component.html',
})

export class ChildComponent implements OnChanges {
  @Input() paramFromParentComponent;

  ngOnChanges(changes) {
    if (!changes.paramFromParentComponent.firstChange
      && changes.paramFromParentComponent.previousValue != changes.paramFromParentComponent.currentValue)
    {
      // your code to reload
    }
  }
}
```

- Parent component:
```html
<child [paramFromParentComponent]="paramFromParentComponent"></child>
```
