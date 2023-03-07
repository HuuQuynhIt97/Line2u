import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[appChatBox]',
  outputs: [
		"appChatBox",
	]
})
export class ChatBoxDirective implements AfterViewInit, OnDestroy , OnInit {
  @Input() appChatBox: string;
  constructor(
    private elementRef: ElementRef
  ) { }
  ngOnInit(): void {
    this.contentHeight(this.elementRef.nativeElement);
  }
  contentHeight(parent: HTMLElement) {
    var height = parent.offsetHeight;
    console.log(height)

  }
  ngOnDestroy(): void {
  }
  ngAfterViewInit(): void {
  }

}
