import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
	selector: '[appAccordion]'
})
export class AccordionDirective {
	constructor(private el: ElementRef, private renderer: Renderer2) {}

	@HostListener('click') handleClickEvent() {
		let accordionTarget;
		let targetClasses;
		if (this.el.nativeElement.children) {
			accordionTarget = this.el.nativeElement.children[1];
		}

		if (accordionTarget.classList) {
			targetClasses = accordionTarget.classList;
		}

		for (const targetClass of targetClasses) {
			if (targetClass === 'hide-body') {
				return this.showBody(accordionTarget);
			}
		}

		return this.hideBody(accordionTarget);
	}

	hideBody(element) {
		this.renderer.removeClass(element, 'show-body');
		this.renderer.addClass(element, 'hide-body');

		const arrowIcon = this.el.nativeElement.getElementsByClassName(
			'accordion-arrow-icon'
		)[0];
		this.renderer.removeClass(arrowIcon, 'icon-down');

		this.renderer.removeClass(this.el.nativeElement, 'accordion-active');
	}

	showBody(element) {
		this.renderer.removeClass(element, 'hide-body');
		this.renderer.addClass(element, 'show-body');

		const arrowIcon = this.el.nativeElement.getElementsByClassName(
			'accordion-arrow-icon'
		)[0];
		this.renderer.addClass(arrowIcon, 'icon-down');

		this.renderer.addClass(this.el.nativeElement, 'accordion-active');
	}
}
