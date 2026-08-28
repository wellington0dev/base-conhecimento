import { Component, ElementRef, forwardRef, signal, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MarkdownPipe } from '../pipes/markdown.pipe';

@Component({
  selector: 'app-markdown-editor',
  imports: [MatButtonModule, MarkdownPipe],
  templateUrl: './markdown-editor.html',
  styleUrl: './markdown-editor.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MarkdownEditor),
      multi: true,
    },
  ],
})
export class MarkdownEditor implements ControlValueAccessor {
  @ViewChild('textarea') private readonly textareaRef?: ElementRef<HTMLTextAreaElement>;

  readonly value = signal('');
  readonly showPreview = signal(false);
  readonly disabled = signal(false);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onInput(value: string) {
    this.value.set(value);
    this.onChange(value);
  }

  markTouched() {
    this.onTouched();
  }

  togglePreview() {
    this.showPreview.update((show) => !show);
  }

  bold() {
    this.wrapSelection('**');
  }

  italic() {
    this.wrapSelection('_');
  }

  code() {
    this.wrapSelection('`');
  }

  heading() {
    this.insertLinePrefix('## ');
  }

  list() {
    this.insertLinePrefix('- ');
  }

  link() {
    const textarea = this.textareaRef?.nativeElement;
    if (!textarea) {
      return;
    }
    const { selectionStart, selectionEnd } = textarea;
    const current = this.value();
    const selected = current.slice(selectionStart, selectionEnd) || 'texto do link';
    const snippet = `[${selected}](https://)`;
    const next = current.slice(0, selectionStart) + snippet + current.slice(selectionEnd);
    const urlStart = selectionStart + selected.length + 3;
    this.applyChange(next, urlStart, urlStart + 8);
  }

  private wrapSelection(marker: string) {
    const textarea = this.textareaRef?.nativeElement;
    if (!textarea) {
      return;
    }
    const { selectionStart, selectionEnd } = textarea;
    const current = this.value();
    const selected = current.slice(selectionStart, selectionEnd);
    const next =
      current.slice(0, selectionStart) + marker + selected + marker + current.slice(selectionEnd);
    this.applyChange(
      next,
      selectionStart + marker.length,
      selectionEnd + marker.length,
    );
  }

  private insertLinePrefix(prefix: string) {
    const textarea = this.textareaRef?.nativeElement;
    if (!textarea) {
      return;
    }
    const { selectionStart } = textarea;
    const current = this.value();
    const lineStart = current.lastIndexOf('\n', selectionStart - 1) + 1;
    const next = current.slice(0, lineStart) + prefix + current.slice(lineStart);
    const cursor = selectionStart + prefix.length;
    this.applyChange(next, cursor, cursor);
  }

  private applyChange(next: string, selectionStart: number, selectionEnd: number) {
    this.value.set(next);
    this.onChange(next);
    queueMicrotask(() => {
      const textarea = this.textareaRef?.nativeElement;
      if (!textarea) {
        return;
      }
      textarea.focus();
      textarea.setSelectionRange(selectionStart, selectionEnd);
    });
  }
}
