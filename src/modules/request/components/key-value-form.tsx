/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useCallback } from "react";
import { useForm, useFieldArray, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Trash2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

// schema for key-value input

const keyValueSchema = z.object({
  // array of items
  items: z.array(
    z.object({
      key: z.string().min(1, "Key is required"),
      value: z.string().min(1, "Value is required"),
      enabled: z.boolean().default(true).optional(),
    })
  ),
});

// type for keyvalue Form data

type KeyValueFormData = z.infer<typeof keyValueSchema>;

export interface KeyValueItem {
  key: string;
  value: string;
  enabled?: boolean; // check key value pair for sending request / parameters is enabled or not
}

interface KeyValueFormEditorProps {
  initialData?: KeyValueItem[]; // intial data for holding key value pair

  onSubmit: (data: KeyValueItem[]) => void; // onSubmit pe keyValue items ko accept kr rha hoga props mein

  placeholder?: {
    key?: string;
    value?: string;
    description?: string;
  };
  className?: string;
}

const KeyValueFormEditor: React.FC<KeyValueFormEditorProps> = ({
  onSubmit,
  initialData,
  placeholder = {
    key: "Key",
    value: "Value",
    description: "Description",
  },
  className,
}) => {
  const form = useForm<KeyValueFormData>({
    resolver: zodResolver(keyValueSchema),
    defaultValues: {
      // if we have intial Data toh woh hi render krenge otherwise empty here

      items:
        initialData && initialData?.length > 0
          ? initialData?.map((item) => ({
              // key: item.key,
              // value: item.value,
              ...item,
              enabled: item.enabled ?? true,
            }))
          : [{ key: "", value: "", enabled: true }],
    },
  });

  // utility to add items in this keyvalue form editor

  const { fields, append, remove } = useFieldArray({
    control: form.control, // take the control of formdata

    name: "items", // here we have to pass name for formdata
  });

  // for adding a new keyvalue pair row

  const addNewRow = () => {
    append({ key: "", value: "", enabled: true });
  };

  // for managing state of enabled , is enabled current state true or false : to toggle , ki humein key value pair data bhejna hai ya nahi

  // manage toggle boolean state

  const toggleEnabled = (index: number) => {
    // here is index : key-value pair row number

    const currentValue = form.getValues(`items.${index}.enabled`);
    form.setValue(`items.${index}.enabled`, !currentValue);
  };

  // for removing a exsiting keyvalue pair row

  const removeRow = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  /*
  
  Auto-save text after user stops typing for a short time

    Best practices : implement debouncing
  
    - Debouncing is a technique 

      - that delays a function's execution until a specified period of time 
     has passed without any further calls to it

      - preventing rapid, repeated invocations and improving performance.

     - we dont' want ki user type kr rha ho aur auto save call hota rhe , we want to auto save after sometime , when user stopped typing
  
  */

  // we have to maintain ref , so that on every reload , tab re-render nahi ho

  const lastSavedRef = useRef<string | null>(null);

  // return the enabled key-value pairs from the enabled items array , means auto save only works on enabled key value pairs

  const getFilteredItemsFromValues = (items: KeyValueItem[]) =>
    items
      .filter(
        (item) => item.enabled && (item.key?.trim() || item.value?.trim())
      )
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

      // now we have to serialise data because here we come with data in form of key value pair object - stringfy - convert to json

      const serialized = JSON.stringify(filtered);
      if (serialized !== lastSavedRef.current) {
        lastSavedRef.current = serialized;
        onSubmit(filtered);
      }
    },
    [onSubmit]
  );

  const debouncedSaveRef = useRef(saveIfChanged);
  // keep ref up to date when saveIfChanged changes
  useEffect(() => {
    debouncedSaveRef.current = saveIfChanged;
  }, [saveIfChanged]);

  const debouncedInvokerRef = useRef<((items: KeyValueItem[]) => void) | null>(
    null
  );

  // useEffect debounce method ko call krega means har 0.5 seconds baad is autosaved ko triggered krega and if value changed hogi toh call hota rhega

  useEffect(() => {
    debouncedInvokerRef.current = debounce((items: KeyValueItem[]) => {
      debouncedSaveRef.current(items);
    }, 500);
  }, []);

  // Watch form values and trigger debounced save
  useEffect(() => {
    const subscription = form.watch((value) => {
      const items = (value as KeyValueFormData)?.items || [];
      debouncedInvokerRef.current?.(items as KeyValueItem[]);
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className={cn("w-full", className)}>
      <Form {...form}>
        <div className="space-y-3">
          {/* Header */}

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-400">Query Params</h3>

            {/* button to add new key value pair row */}

            <Button
              type="button"
              variant={"ghost"}
              size={"sm"}
              onClick={addNewRow}
              className="flex items-center gap-1 text-zinc-300 hover:text-white hover:bg-zinc-700/60 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="text-xs font-medium">Add</span>
            </Button>
          </div>

          {/* Table-like layout */}

          <div className="w-full border border-zinc-800  overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 bg-zinc-900 text-xs text-zinc-500 border-b border-zinc-800">
              <div className="col-span-5 border-r font-medium border-zinc-800 px-3 py-2">
                KEY
              </div>
              <div className="col-span-5 border-r font-medium  border-zinc-800 px-3 py-2">
                VALUE
              </div>

              <div className="hidden lg:block col-span-1 border-r border-zinc-800 font-medium  px-3 py-2 text-white/30">
                ON/OFF
              </div>

              <div className="hidden lg:block col-span-1 border-r border-zinc-800 font-medium  px-3 py-2">
                DELETE
              </div>

              <div className="col-span-1 border-r border-zinc-800 px-3 py-2 text-white/30  font-medium lg:hidden">
                <Check className="w-4 h-4 border" />
              </div>

              <div className="col-span-1 font-medium  border-r border-zinc-800 px-3 py-2 text-white/30 lg:hidden">
                <Trash2 className="w-4 h-4" />
              </div>
            </div>

            {/* Rows */}
            <div>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={cn(
                    "grid grid-cols-12 items-center text-sm border-t border-zinc-800",
                    form.watch(`items.${index}.enabled`)
                      ? "bg-zinc-900"
                      : "bg-zinc-800/50 opacity-60"
                  )}
                >
                  {/* Key Input*/}
                  <div className="col-span-5 border-r border-zinc-800 px-3 py-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.key`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={placeholder.key}
                              className="bg-transparent border-0 focus:ring-0 rounded-none text-xs text-zinc-200 placeholder:text-zinc-500"
                              disabled={!form.watch(`items.${index}.enabled`)}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Value */}
                  <div className="col-span-5 border-r border-zinc-800 px-3 py-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={placeholder.value}
                              className={cn(
                                "bg-transparent border-0 focus:ring-0 text-xs rounded-none placeholder:text-zinc-500"
                              )}
                              disabled={!form.watch(`items.${index}.enabled`)}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Enabled */}
                  <div className="col-span-1 border-r border-zinc-800 flex items-center justify-center px-3 py-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.enabled`}
                      render={({ field: checkBoxField }) => (
                        <FormItem>
                          <FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleEnabled(index)}
                              className={cn(
                                "h-5 w-5 p-0 rounded-none border transition-colors",
                                checkBoxField.value
                                  ? "bg-black/5 border-black/15 text-white hover:bg-gray-800"
                                  : ""
                              )}
                            >
                              {checkBoxField.value ? (
                                <Check className="h-3 w-3" />
                              ) : null}
                            </Button>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Delete */}
                  <div className="col-span-1 flex items-center justify-center px-3 py-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRow(index)}
                      disabled={fields.length <= 1}
                      className={cn(
                        "h-5 w-5 p-0 transition-colors",
                        fields.length <= 1
                          ? "text-zinc-600 cursor-not-allowed"
                          : "text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      )}
                    >
                      <Trash2 className="h-3 w-3 text-gray-300" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Autosave enabled — changes are saved automatically */}
          <div className="flex justify-end pt-4">
            <span className="text-xs text-zinc-500">
              Changes saved automatically
            </span>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default KeyValueFormEditor;

// useFieldArray: A custom hook that exposes convenient methods to perform operations with a list of dynamic inputs that need to be appended, updated, removed etc.

// useFieldArray : coz hum multiple parameters pe kam kr rhe hai

// watch : Watch and subscribe to the entire form update/change based on onChange and re-render at the useForm.
