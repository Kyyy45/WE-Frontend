"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import {
  useForm,
  useFieldArray,
  useWatch,
  Controller,
  Control,
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { api } from "@/lib/axios";

// Validasi Import
import {
  formEditorSchema,
  FormEditorValues,
  FormSectionItem,
} from "@/lib/validations";

// DnD Kit Imports
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  defaultDropAnimationSideEffects,
  rectIntersection,
  DropAnimation,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Import Types
import { Form, FormField } from "@/types/form";
import { slugify } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Trash2,
  GripVertical,
  Save,
  ArrowLeft,
  AlignJustify,
  Eye,
  RefreshCw,
  X,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- HELPERS ---
const generateId = () => `id_${Math.random().toString(36).substr(2, 9)}`;

// Flatten: Backend (Flat) -> Editor (Nested)
const flattenToNested = (flatFields: FormField[]): FormSectionItem[] => {
  const sections: FormSectionItem[] = [];

  let currentSection: any = {
    id: `sec_${generateId()}`,
    label: "Bagian Utama",
    key: "main_section",
    fields: [],
  };

  flatFields.forEach((field) => {
    if (field.type === "header") {
      if (
        currentSection.key === "main_section" &&
        currentSection.fields.length === 0
      ) {
        currentSection = {
          id: `sec_${generateId()}`,
          label: field.label,
          key: field.key,
          fields: [],
        };
      } else {
        sections.push(currentSection);
        currentSection = {
          id: `sec_${generateId()}`,
          label: field.label,
          key: field.key,
          fields: [],
        };
      }
    } else {
      currentSection.fields.push({ ...field, id: `field_${generateId()}` });
    }
  });

  sections.push(currentSection);
  return sections;
};

const nestedToFlatten = (sections: FormSectionItem[]): FormField[] => {
  const flat: FormField[] = [];
  sections.forEach((section, index) => {
    if (index > 0 || sections.length > 1) {
      flat.push({
        label: section.label,
        key: section.key,
        type: "header",
        required: false,
        placeholder: "",
        helpText: "",
        options: [],
      });
    }
    section.fields.forEach((f: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = f;
      flat.push(rest);
    });
  });
  return flat;
};

interface FormBuilderProps {
  initialData?: Form;
  isEditMode?: boolean;
}

export function FormBuilder({
  initialData,
  isEditMode = false,
}: FormBuilderProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDragItem, setActiveDragItem] = useState<any>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: "section" | "field";
    sectionIndex: number;
    fieldIndex?: number;
  } | null>(null);

  const getInitialValues = (): any => {
    if (!isEditMode && typeof window !== "undefined") {
      const saved = localStorage.getItem("form-builder-draft-v9");
      if (saved) return JSON.parse(saved);
    }
    if (initialData?.fields) {
      return {
        name: initialData.name,
        description: initialData.description || "",
        status: initialData.status,
        visibility: initialData.visibility,
        sections: flattenToNested(initialData.fields),
      };
    }
    return {
      name: "",
      description: "",
      status: "active",
      visibility: "public",
      sections: [
        {
          id: `sec_${generateId()}`,
          label: "Identitas Diri",
          key: "header_identitas",
          fields: [
            {
              id: `field_${generateId()}`,
              label: "Nama Lengkap",
              key: "nama_lengkap",
              type: "text",
              required: true,
              placeholder: "Masukkan nama lengkap",
              helpText: "Sesuai KTP",
              options: [],
            },
          ],
        },
      ],
    };
  };

  const form = useForm<FormEditorValues>({
    defaultValues: getInitialValues(),
    resolver: zodResolver(formEditorSchema),
    mode: "onSubmit",
  });

  const {
    fields: sections,
    append,
    remove,
    move,
  } = useFieldArray({
    control: form.control,
    name: "sections",
  });

  const watchedSections = useWatch({
    control: form.control,
    name: "sections",
  });

  const { errors } = form.formState;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isEditMode) return;
    const subscription = form.watch((value) => {
      localStorage.setItem("form-builder-draft-v9", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form, isEditMode]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findSectionId = (id: string) => {
    if (id.startsWith("sec_")) return id;
    const section = watchedSections?.find((s) =>
      s.fields.some((f) => f.id === id)
    );
    return section ? section.id : null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = active.id as string;
    setActiveId(id);

    if (id.startsWith("sec_")) {
      const section = watchedSections?.find((s) => s.id === id);
      setActiveDragItem({ type: "section", ...section });
    } else {
      const field = watchedSections
        ?.flatMap((s) => s.fields)
        .find((f) => f.id === id);
      setActiveDragItem({ type: "field", ...field });
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const overId = over?.id;

    if (!overId || active.id === overId || !watchedSections) return;

    const activeContainer = findSectionId(active.id as string);
    const overContainer = findSectionId(overId as string);

    if (!activeContainer || !overContainer || activeContainer === overContainer)
      return;

    const activeSectionIndex = watchedSections.findIndex(
      (s) => s.id === activeContainer
    );
    const overSectionIndex = watchedSections.findIndex(
      (s) => s.id === overContainer
    );

    if (activeSectionIndex === -1 || overSectionIndex === -1) return;

    const activeItems = [...watchedSections[activeSectionIndex].fields];
    const overItems = [...watchedSections[overSectionIndex].fields];

    const activeIndex = activeItems.findIndex((i) => i.id === active.id);
    const overIndex = overItems.findIndex((i) => i.id === overId);

    let newIndex;
    if (overId.toString().startsWith("sec_")) {
      newIndex = overItems.length + 1;
    } else {
      const isBelowOverItem =
        over &&
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;
      const modifier = isBelowOverItem ? 1 : 0;
      newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
    }

    const [movedItem] = activeItems.splice(activeIndex, 1);
    overItems.splice(newIndex, 0, movedItem);

    form.setValue(`sections.${activeSectionIndex}.fields`, activeItems);
    form.setValue(`sections.${overSectionIndex}.fields`, overItems);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = active.id as string;
    const overId = over?.id as string;

    if (!overId || activeId === overId || !watchedSections) {
      setActiveId(null);
      setActiveDragItem(null);
      return;
    }

    const activeContainer = findSectionId(activeId);
    const overContainer = findSectionId(overId);

    if (activeContainer && overContainer && activeContainer === overContainer) {
      const sectionIndex = watchedSections.findIndex(
        (s) => s.id === activeContainer
      );
      const items = [...watchedSections[sectionIndex].fields];

      const oldIndex = items.findIndex((i) => i.id === activeId);
      const newIndex = items.findIndex((i) => i.id === overId);

      const newItems = arrayMove(items, oldIndex, newIndex);
      form.setValue(`sections.${sectionIndex}.fields`, newItems);
    } else if (activeId.startsWith("sec_") && overId.startsWith("sec_")) {
      const oldIndex = watchedSections.findIndex((s) => s.id === activeId);
      const newIndex = watchedSections.findIndex((s) => s.id === overId);
      move(oldIndex, newIndex);
    }

    setActiveId(null);
    setActiveDragItem(null);
  };

  const handleDelete = () => {
    if (!deleteDialog || !watchedSections) return;
    if (deleteDialog.type === "section") {
      remove(deleteDialog.sectionIndex);
    } else if (deleteDialog.fieldIndex !== undefined) {
      const currentFields = [
        ...watchedSections[deleteDialog.sectionIndex].fields,
      ];
      currentFields.splice(deleteDialog.fieldIndex, 1);
      form.setValue(
        `sections.${deleteDialog.sectionIndex}.fields`,
        currentFields
      );
    }
    setDeleteDialog(null);
  };

  const onInvalid = (errors: any) => {
    console.error("Validation Errors:", errors);
    toast.error("Gagal menyimpan. Mohon lengkapi field yang berwarna merah.");
  };

  const onSubmit = async (data: FormEditorValues) => {
    const seenKeys = new Set<string>();
    let hasDuplicate = false;

    data.sections.forEach((section, sIndex) => {
      if (seenKeys.has(section.key)) {
        form.setError(`sections.${sIndex}.key`, { message: "Duplikat!" });
        hasDuplicate = true;
      } else {
        if (section.key) seenKeys.add(section.key);
      }

      section.fields.forEach((field, fIndex) => {
        if (seenKeys.has(field.key)) {
          form.setError(`sections.${sIndex}.fields.${fIndex}.key` as any, {
            message: "Duplikat!",
          });
          hasDuplicate = true;
        } else {
          if (field.key) seenKeys.add(field.key);
        }
      });
    });

    if (hasDuplicate) {
      toast.error("Terdapat Key ID yang duplikat. Mohon perbaiki.");
      return;
    }

    try {
      const flatPayload = {
        name: data.name,
        description: data.description,
        status: data.status,
        visibility: data.visibility,
        fields: nestedToFlatten(data.sections),
      };

      if (isEditMode && initialData) {
        await api.patch(`/forms/${initialData.id}`, flatPayload);
        toast.success("Berhasil diperbarui!");
      } else {
        await api.post("/forms", flatPayload);
        toast.success("Berhasil dibuat!");
        localStorage.removeItem("form-builder-draft-v9");
      }
      router.push("/dashboard/admin/forms");
      router.refresh();
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Terjadi kesalahan.");
      }
    } finally {
      setIsPreviewOpen(false);
    }
  };

  const dropAnimationConfig: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: { opacity: "0.5" },
      },
    }),
  };

  if (!mounted) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="space-y-8 pb-20"
      >
        {/* HEADER BAR */}
        <div className="flex items-center justify-between sticky top-0 z-20 bg-background/95 backdrop-blur py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {isEditMode ? "Edit Form" : "Buat Form Baru"}
              </h1>
              <p className="text-muted-foreground text-sm">
                Desain formulir pendaftaran.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditMode && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsResetOpen(true)}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Reset
              </Button>
            )}
            <Button type="button" onClick={() => setIsPreviewOpen(true)}>
              <Eye className="mr-2 h-4 w-4" /> Preview
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Simpan
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 items-start">
          {/* LEFT: SETTINGS */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Informasi Dasar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label className={cn(errors.name && "text-destructive")}>
                    Nama Form *
                  </Label>
                  <Input
                    placeholder="Contoh: Form Pendaftaran"
                    {...form.register("name")}
                    className={cn(
                      errors.name &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label>Deskripsi</Label>
                  <Textarea
                    placeholder="Keterangan..."
                    {...form.register("description")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Aktif</SelectItem>
                          <SelectItem value="inactive">Non-Aktif</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Akses</Label>
                  <Controller
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Publik</SelectItem>
                          <SelectItem value="authenticated">
                            Login Wajib
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: BUILDER */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Struktur Form
              </h2>
              <Button
                type="button"
                onClick={() =>
                  append({
                    id: `sec_${generateId()}`,
                    label: "Header Baru",
                    key: `header_${Date.now()}`,
                    fields: [],
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Tambah Header
              </Button>
            </div>

            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-6">
                {sections.map((section, index) => (
                  <SortableSection
                    key={section.id}
                    section={section}
                    sectionIndex={index}
                    control={form.control}
                    register={form.register}
                    setValue={form.setValue}
                    errors={errors}
                    onDeleteSection={() =>
                      setDeleteDialog({
                        isOpen: true,
                        type: "section",
                        sectionIndex: index,
                      })
                    }
                    onDeleteField={(fIndex: number) =>
                      setDeleteDialog({
                        isOpen: true,
                        type: "field",
                        sectionIndex: index,
                        fieldIndex: fIndex,
                      })
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </div>
        </div>

        {/* DRAG OVERLAY */}
        <DragOverlay dropAnimation={dropAnimationConfig}>
          {activeId && activeDragItem ? (
            <div
              className={cn(
                "p-4 rounded-md shadow-2xl cursor-grabbing border-2 border-primary bg-card opacity-100",
                activeDragItem.type === "section" ? "w-150 h-20" : "w-125"
              )}
            >
              <div className="flex items-center gap-3">
                {activeDragItem.type === "section" ? (
                  <AlignJustify className="w-6 h-6 text-primary" />
                ) : (
                  <GripVertical className="w-5 h-5 text-muted-foreground" />
                )}
                <div className="flex-1">
                  <p className="font-bold text-lg text-foreground">
                    {activeDragItem.label}
                  </p>
                  {activeDragItem.type === "field" && (
                    <p className="text-xs text-muted-foreground uppercase">
                      {activeDragItem.type}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </form>

      {/* PREVIEW DIALOG */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col p-0 overflow-hidden sm:max-w-4xl">
          <DialogHeader className="px-6 py-4 border-b border-border">
            <DialogTitle className="text-xl">Preview Form</DialogTitle>
            <DialogDescription>
              Tinjau tampilan formulir sebelum disimpan.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 bg-background">
            <div className="p-6">
              <div className="max-w-2xl mx-auto space-y-8 bg-card text-card-foreground p-8 shadow-sm border border-border rounded-lg">
                <div className="text-center border-b border-border pb-6">
                  <h1 className="text-3xl font-bold text-primary">
                    {form.getValues("name")}
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    {form.getValues("description")}
                  </p>
                </div>
                <FormPreviewRenderer sections={form.getValues("sections")} />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="px-6 py-4 border-t border-border bg-background">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPreviewOpen(false)}
            >
              Kembali
            </Button>
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit, onInvalid)}
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RESET ALERT */}
      <AlertDialog open={isResetOpen} onOpenChange={setIsResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset?</AlertDialogTitle>
            <AlertDialogDescription>Data akan hilang.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                localStorage.removeItem("form-builder-draft-v9");
                window.location.reload();
              }}
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* DELETE ALERT */}
      <AlertDialog
        open={!!deleteDialog}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus?</AlertDialogTitle>
            <AlertDialogDescription>
              Item ini akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DndContext>
  );
}

// --- SUB COMPONENTS ---

interface SortableSectionProps {
  section: FormSectionItem;
  sectionIndex: number;
  control: Control<FormEditorValues>;
  register: UseFormRegister<FormEditorValues>;
  setValue: UseFormSetValue<FormEditorValues>;
  onDeleteSection: () => void;
  onDeleteField: (fIndex: number) => void;
  errors: FieldErrors<FormEditorValues>;
}

function SortableSection({
  section,
  sectionIndex,
  control,
  register,
  setValue,
  onDeleteSection,
  onDeleteField,
  errors,
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.3 : 1,
  };

  const fields =
    useWatch({ control, name: `sections.${sectionIndex}.fields` }) || [];

  const sectionLabelError = errors?.sections?.[sectionIndex]?.label;
  const sectionKeyError = errors?.sections?.[sectionIndex]?.key;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "border-l-4 border-l-primary shadow-sm relative group bg-card",
        (sectionLabelError || sectionKeyError) &&
          "border-destructive border-l-destructive"
      )}
    >
      <CardHeader className="bg-accent/10 pb-4">
        <div className="flex items-start gap-4">
          <div
            {...attributes}
            {...listeners}
            className="mt-2 cursor-grab p-1 hover:bg-muted rounded"
          >
            <AlignJustify className="w-5 h-5 text-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            <div className="grid gap-1">
              <Label
                className={cn(
                  "text-xs text-primary font-bold",
                  sectionLabelError && "text-destructive"
                )}
              >
                Judul Header *
              </Label>
              <Input
                {...register(`sections.${sectionIndex}.label`, {
                  required: "Judul wajib diisi",
                })}
                placeholder="Header"
                className={cn(
                  "font-bold border-primary/20 focus-visible:ring-primary",
                  sectionLabelError &&
                    "border-destructive focus-visible:ring-destructive"
                )}
                onChange={(e) => {
                  register(`sections.${sectionIndex}.label`).onChange(e);
                  setValue(
                    `sections.${sectionIndex}.key`,
                    slugify(e.target.value).replace(/-/g, "_")
                  );
                }}
              />
              {sectionLabelError && (
                <p className="text-xs text-destructive">
                  {sectionLabelError.message}
                </p>
              )}
            </div>
            <div className="grid gap-1">
              <Label
                className={cn(
                  "text-xs text-muted-foreground",
                  sectionKeyError && "text-destructive"
                )}
              >
                Key ID
              </Label>
              <Input
                {...register(`sections.${sectionIndex}.key`)}
                className="font-mono text-xs bg-muted/50"
                readOnly
              />
              {sectionKeyError && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {sectionKeyError.message}
                </p>
              )}
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10"
            onClick={onDeleteSection}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <SortableContext
          items={fields.map((f: any) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3 min-h-5">
            {fields.map((field: any, fieldIndex: number) => (
              <SortableField
                key={field.id}
                id={field.id}
                field={field}
                sectionIndex={sectionIndex}
                fieldIndex={fieldIndex}
                control={control}
                register={register}
                onDelete={() => onDeleteField(fieldIndex)}
                setValue={setValue}
                errors={errors}
              />
            ))}
          </div>
        </SortableContext>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full border-dashed hover:border-primary hover:text-primary transition-colors"
          onClick={() => {
            const currentFields = [...fields];
            currentFields.push({
              id: `field_${generateId()}`,
              label: "Pertanyaan Baru",
              key: `field_${Date.now()}`,
              type: "text",
              required: false,
              placeholder: "",
              helpText: "",
              options: [],
            });
            setValue(`sections.${sectionIndex}.fields`, currentFields);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Tambah Pertanyaan
        </Button>
      </CardContent>
    </Card>
  );
}

interface SortableFieldProps {
  id: string;
  field: any;
  sectionIndex: number;
  fieldIndex: number;
  control: Control<FormEditorValues>;
  register: UseFormRegister<FormEditorValues>;
  setValue: UseFormSetValue<FormEditorValues>;
  onDelete: () => void;
  errors: FieldErrors<FormEditorValues>;
}

function SortableField({
  id,
  sectionIndex,
  fieldIndex,
  control,
  register,
  onDelete,
  setValue,
  errors,
}: SortableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.3 : 1,
  };

  const typeValue = useWatch({
    control,
    name: `sections.${sectionIndex}.fields.${fieldIndex}.type`,
  });
  const hidePlaceholder = [
    "date",
    "checkbox",
    "radio",
    "header",
    "select",
  ].includes(typeValue);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    register(`sections.${sectionIndex}.fields.${fieldIndex}.label`).onChange(e);
    const val = e.target.value;
    const newKey = slugify(val).replace(/-/g, "_");
    setValue(`sections.${sectionIndex}.fields.${fieldIndex}.key`, newKey);
  };

  const fieldLabelError =
    errors?.sections?.[sectionIndex]?.fields?.[fieldIndex]?.label;
  const fieldKeyError =
    errors?.sections?.[sectionIndex]?.fields?.[fieldIndex]?.key;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-card border rounded-md p-4 flex gap-4 items-start group hover:border-primary/50 transition-all shadow-sm",
        (fieldLabelError || fieldKeyError) && "border-destructive"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="mt-2 cursor-grab text-muted-foreground hover:text-foreground p-1 hover:bg-muted rounded"
      >
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="flex-1 grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-1">
            <Label
              className={cn(
                "text-xs font-semibold",
                fieldLabelError && "text-destructive"
              )}
            >
              Label Pertanyaan *
            </Label>
            <Input
              {...register(
                `sections.${sectionIndex}.fields.${fieldIndex}.label`,
                { required: "Label wajib diisi" }
              )}
              placeholder="Label"
              className={cn(
                "font-medium",
                fieldLabelError && "border-destructive"
              )}
              onChange={handleLabelChange}
            />
            {fieldLabelError && (
              <p className="text-xs text-destructive">
                {fieldLabelError.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="text-xs font-semibold">Tipe</Label>
            <Controller
              control={control}
              name={`sections.${sectionIndex}.fields.${fieldIndex}.type`}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Teks Singkat</SelectItem>
                    <SelectItem value="textarea">Teks Panjang</SelectItem>
                    <SelectItem value="number">Angka</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">No. Telepon</SelectItem>
                    <SelectItem value="date">Tanggal</SelectItem>
                    <SelectItem value="select">Dropdown</SelectItem>
                    <SelectItem value="radio">Radio Button</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-3 rounded text-sm border">
          <div className="grid gap-1">
            <Label
              className={cn(
                "text-xs text-muted-foreground",
                fieldKeyError && "text-destructive"
              )}
            >
              Key ID
            </Label>
            <Input
              {...register(`sections.${sectionIndex}.fields.${fieldIndex}.key`)}
              className={cn(
                "h-8 font-mono text-xs bg-background",
                fieldKeyError && "border-destructive bg-destructive/10"
              )}
            />
            {fieldKeyError && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {fieldKeyError.message}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 mt-auto">
            <Controller
              control={control}
              name={`sections.${sectionIndex}.fields.${fieldIndex}.required`}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id={`req-${id}`}
                  />
                  <Label htmlFor={`req-${id}`}>Wajib Diisi?</Label>
                </div>
              )}
            />
          </div>
          <div
            className={cn(
              "col-span-1 md:col-span-2 grid gap-4 pt-2 border-t",
              hidePlaceholder ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
            )}
          >
            {!hidePlaceholder && (
              <div className="grid gap-1">
                <Label className="text-[10px] uppercase text-muted-foreground">
                  Placeholder
                </Label>
                <Input
                  {...register(
                    `sections.${sectionIndex}.fields.${fieldIndex}.placeholder`
                  )}
                  className="h-8 text-xs bg-background"
                  placeholder="Contoh..."
                />
              </div>
            )}
            <div className="grid gap-1">
              <Label className="text-[10px] uppercase text-muted-foreground">
                Help Text
              </Label>
              <Input
                {...register(
                  `sections.${sectionIndex}.fields.${fieldIndex}.helpText`
                )}
                className="h-8 text-xs bg-background"
                placeholder="Keterangan..."
              />
            </div>
          </div>
        </div>
        {["select", "radio", "checkbox"].includes(typeValue) && (
          <div className="border rounded bg-background p-3">
            <Label className="text-xs font-bold mb-2 block">Opsi Jawaban</Label>
            <OptionsEditor
              sectionIndex={sectionIndex}
              fieldIndex={fieldIndex}
              control={control}
              register={register}
              setValue={setValue}
            />
          </div>
        )}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive h-8 w-8"
        onClick={onDelete}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

function OptionsEditor({
  sectionIndex,
  fieldIndex,
  control,
  register,
  setValue,
}: any) {
  const options =
    useWatch({
      control,
      name: `sections.${sectionIndex}.fields.${fieldIndex}.options`,
    }) || [];

  const addOption = () => {
    const newOpts = [...options, { label: "", value: "" }];
    setValue(`sections.${sectionIndex}.fields.${fieldIndex}.options`, newOpts);
  };

  const removeOption = (idx: number) => {
    const newOpts = options.filter((_: any, i: number) => i !== idx);
    setValue(`sections.${sectionIndex}.fields.${fieldIndex}.options`, newOpts);
  };

  return (
    <div className="space-y-2">
      {options.map((opt: any, k: number) => (
        <div key={k} className="flex gap-2">
          <Input
            {...register(
              `sections.${sectionIndex}.fields.${fieldIndex}.options.${k}.label`
            )}
            placeholder="Label"
            className="h-8 text-xs flex-1"
          />
          <Input
            {...register(
              `sections.${sectionIndex}.fields.${fieldIndex}.options.${k}.value`
            )}
            placeholder="Value"
            className="h-8 text-xs flex-1 font-mono bg-muted/30"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => removeOption(k)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full border-dashed h-8 text-xs"
        onClick={addOption}
      >
        <Plus className="mr-2 h-3 w-3" /> Tambah Opsi
      </Button>
    </div>
  );
}

function FormPreviewRenderer({ sections }: { sections: FormSectionItem[] }) {
  return (
    <div className="space-y-8">
      {sections?.map((section, idx) => (
        <div key={idx} className="space-y-4">
          <div className="pb-2 border-b-2 border-primary/20">
            <h3 className="text-xl font-bold text-primary">{section.label}</h3>
          </div>
          <div className="grid gap-6">
            {section.fields?.map((field, fIdx) => (
              <div key={fIdx} className="space-y-2">
                <Label>
                  {field.label}{" "}
                  {field.required && (
                    <span className="text-destructive">*</span>
                  )}
                </Label>
                {/* PREVIEW FIX: Gunakan readOnly alih-alih disabled agar tidak abu-abu */}
                {["text", "email", "number", "phone"].includes(field.type) && (
                  <Input
                    placeholder={field.placeholder || ""}
                    readOnly
                    className="focus-visible:ring-0 cursor-default"
                  />
                )}
                {field.type === "textarea" && (
                  <Textarea
                    placeholder={field.placeholder || ""}
                    readOnly
                    className="focus-visible:ring-0 cursor-default"
                  />
                )}
                {field.type === "date" && (
                  <Input
                    type="date"
                    readOnly
                    className="w-full focus-visible:ring-0 cursor-default"
                  />
                )}
                {["select"].includes(field.type) && (
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                  </Select>
                )}
                {(field.type === "radio" || field.type === "checkbox") && (
                  <div className="space-y-2 pl-1">
                    {field.options?.map((opt: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <div
                          className={`h-4 w-4 border border-primary/50 ${
                            field.type === "radio" ? "rounded-full" : "rounded"
                          }`}
                        />{" "}
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
                {field.helpText && (
                  <p className="text-[0.8rem] text-muted-foreground">
                    {field.helpText}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
