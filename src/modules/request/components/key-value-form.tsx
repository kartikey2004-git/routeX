/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

/*
  Editable key/value table used for query parameters and headers.
  Edits autosave after a short pause; disabled rows stay visible but are not
  sent. A blank row is allowed, so the form never shows validation noise.
*/

const keyValueSchema = z.object({
  items: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
      enabled: z.boolean().default(true).optional(),
    }),
  ),
});

type KeyValueFormData = z.infer<typeof keyValueSchema>;

export interface KeyValueItem {
  key: string;
  value: string;
  enabled?: boolean;
}

interface KeyValueFormEditorProps {
  title: string;
  initialData?: KeyValueItem[];
  onSubmit: (data: KeyValueItem[]) => void;
  placeholder?: {
    key?: string;
    value?: string;
    description?: string;
  };
  className?: string;
}

const KeyValueFormEditor: React.FC<KeyValueFormEditorProps> = ({
  title,
  onSubmit,
  initialData,
  placeholder = { key: "Key", value: "Value", description: "Item" },
  className,
}) => {
  const form = useForm<KeyValueFormData>({
    resolver: zodResolver(keyValueSchema),
    defaultValues: {
      items:
        initialData && initialData.length > 0
          ? initialData.map((item) => ({
              ...item,
              enabled: item.enabled ?? true,
            }))
          : [{ key: "", value: "", enabled: true }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const addNewRow = () => {
    append({ key: "", value: "", enabled: true });
  };

  const toggleEnabled = (index: number) => {
    const currentValue = form.getValues(`items.${index}.enabled`);
    form.setValue(`items.${index}.enabled`, !currentValue);
  };

  const removeRow = (index: number) => {
    remove(index);
  };

  // Only enabled, non-empty rows are saved.
  const lastSavedRef = useRef<string | null>(null);

  const getFilteredItemsFromValues = (items: KeyValueItem[]) =>
    items
      .filter((item) => item.enabled && (item.key?.trim() || item.value?.trim()))
      .map(({ key, value }) => ({ key, value }));

  const debounce = (fn: (...args: any[]) => void, wait = 500) => {
    let t: ReturnType<typeof setTimeout> | null = null;
    return (...args: any[]) => {
      if (t) clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  };

  const saveIfChanged = useCallback(
    (items: KeyValueItem[]) => {
      const filtered = getFilteredItemsFromValues(items);
      const serialized = JSON.stringify(filtered);
      if (serialized !== lastSavedRef.current) {
        lastSavedRef.current = serialized;
        onSubmit(filtered);
      }
    },
    [onSubmit],
  );

  const debouncedSaveRef = useRef(saveIfChanged);
  useEffect(() => {
    debouncedSaveRef.current = saveIfChanged;
  }, [saveIfChanged]);

  const debouncedInvokerRef = useRef<((items: KeyValueItem[]) => void) | null>(
    null,
  );

  useEffect(() => {
    debouncedInvokerRef.current = debounce((items: KeyValueItem[]) => {
      debouncedSaveRef.current(items);
    }, 500);
  }, []);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const items = (value as KeyValueFormData)?.items || [];
      debouncedInvokerRef.current?.(items as KeyValueItem[]);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const watchedItems = form.watch("items");
  const enabledCount = getFilteredItemsFromValues(
    (watchedItems ?? []) as KeyValueItem[],
  ).length;

  const cellInput =
    "h-8 rounded-none border-0 bg-transparent px-2.5 font-mono text-[13px] text-foreground shadow-none placeholder:font-sans placeholder:text-muted-foreground/60 focus-visible:ring-inset focus-visible:ring-1 disabled:opacity-100";

  return (
    <div className={cn("w-full", className)}>
      <Form {...form}>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-medium text-muted-foreground">
            {title}
            <span className="ml-2 font-normal text-muted-foreground/70">
              {enabledCount} sent
            </span>
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addNewRow}
            className="h-7 text-[13px] text-muted-foreground"
          >
            <Plus />
            Add row
          </Button>
        </div>

        <div className="overflow-hidden rounded-md border border-border">
          <div className="grid grid-cols-[minmax(0,5fr)_minmax(0,5fr)_auto_auto] items-center border-b border-border bg-surface text-xs text-muted-foreground">
            <div className="px-2.5 py-1.5">Name</div>
            <div className="px-2.5 py-1.5">Value</div>
            <div className="w-16 px-2 py-1.5 text-center">Send</div>
            <div className="w-10 px-2 py-1.5" />
          </div>

          <ul>
            {fields.map((field, index) => {
              const enabled = form.watch(`items.${index}.enabled`);
              return (
                <li
                  key={field.id}
                  className={cn(
                    "grid grid-cols-[minmax(0,5fr)_minmax(0,5fr)_auto_auto] items-center border-b border-border last:border-b-0 focus-within:bg-muted/40",
                    !enabled && "text-muted-foreground",
                  )}
                >
                  <FormField
                    control={form.control}
                    name={`items.${index}.key`}
                    render={({ field }) => (
                      <FormItem className="min-w-0">
                        <FormControl>
                          <Input
                            {...field}
                            aria-label={`${placeholder.description ?? "Item"} name, row ${index + 1}`}
                            placeholder={placeholder.key}
                            className={cn(cellInput, "w-full")}
                            disabled={!enabled}
                            spellCheck={false}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="min-w-0 border-l border-border">
                        <FormControl>
                          <Input
                            {...field}
                            aria-label={`${placeholder.description ?? "Item"} value, row ${index + 1}`}
                            placeholder={placeholder.value}
                            className={cn(cellInput, "w-full")}
                            disabled={!enabled}
                            spellCheck={false}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex w-16 items-center justify-center border-l border-border py-2">
                    <Switch
                      size="sm"
                      checked={enabled}
                      onCheckedChange={() => toggleEnabled(index)}
                      aria-label={
                        enabled ? `Turn off row ${index + 1}` : `Turn on row ${index + 1}`
                      }
                    />
                  </div>

                  <div className="flex w-10 items-center justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeRow(index)}
                      className="size-7 text-muted-foreground hover:text-destructive"
                      aria-label={`Remove row ${index + 1}`}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">Changes save as you type.</p>
      </Form>
    </div>
  );
};

export default KeyValueFormEditor;
