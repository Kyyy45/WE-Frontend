"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Layout & UI Components
import { Header } from "@/components/landing-page/header";
import FooterSection from "@/components/landing-page/footer";
import { Container } from "@/components/layout/container";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// AlertDialog Components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Icons
import {
  IconChevronLeft,
  IconShieldCheck,
  IconCreditCard,
  IconWallet,
  IconBuildingBank,
  IconLock,
  IconInfoCircle,
} from "@tabler/icons-react";

export default function EnrollmentFormPage() {
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Mock Data
  const selectedCourse = {
    title: "IELTS Intensive Prep",
    image: "/hero-section/setup-meja.png",
    regisFee: 250000,
    sppFee: 450000,
  };

  const total = selectedCourse.regisFee + selectedCourse.sppFee;

  return (
    <div className="flex min-h-screen flex-col bg-background overflow-x-clip">
      <Header />

      <main className="flex-1">
        <SectionWrapper className="relative border-b border-border/50">
          <div className="absolute inset-y-0 left-0 w-px bg-border/40 hidden lg:block ml-[5%]"></div>
          <div className="absolute inset-y-0 right-0 w-px bg-border/40 hidden lg:block mr-[5%]"></div>

          <Container className="pt-32 pb-24 md:pt-44 lg:pt-52">
            <Link
              href="/courses/1"
              className="group mb-12 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <IconChevronLeft size={18} />
              Kembali ke Detail
            </Link>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-12">
              Lengkapi{" "}
              <span className="font-serif italic font-normal text-primary">
                Pembayaran
              </span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
              <div className="space-y-8">
                {/* Bagian 1: Informasi Pribadi */}
                <div className="p-8 roundend-4xl border border-border bg-card/50 backdrop-blur-sm space-y-6">
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">
                      1
                    </div>
                    Informasi Pribadi
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nama Depan</Label>
                      <Input
                        id="firstName"
                        placeholder="Nama depan Anda"
                        className="rounded-xl h-12"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nama Belakang</Label>
                      <Input
                        id="lastName"
                        placeholder="Nama belakang Anda"
                        className="rounded-xl h-12"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Alamat Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      className="rounded-xl h-12"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Bagian 2: Metode Pembayaran */}
                <div className="p-8 rounded-4xl border border-border bg-card/50 backdrop-blur-sm space-y-8">
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">
                      2
                    </div>
                    Metode Pembayaran
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        id: "bank_transfer",
                        label: "Transfer Bank",
                        icon: <IconBuildingBank size={20} />,
                      },
                      {
                        id: "e_wallet",
                        label: "E-Wallet",
                        icon: <IconWallet size={20} />,
                      },
                      {
                        id: "card",
                        label: "Kartu Kredit",
                        icon: <IconCreditCard size={20} />,
                      },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setPaymentMethod(item.id)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all",
                          paymentMethod === item.id
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border bg-transparent text-muted-foreground hover:border-primary/30"
                        )}
                      >
                        {item.icon}
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-muted/50 border border-border flex items-start gap-3">
                    <IconLock
                      size={18}
                      className="text-muted-foreground shrink-0 mt-0.5"
                    />
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Pembayaran Anda akan diproses secara aman melalui gerbang
                      pembayaran terenkripsi. Worldpedia tidak menyimpan
                      informasi kartu atau akun bank Anda.
                    </p>
                  </div>

                  {/* BUTTON BAYAR DENGAN ALERT DIALOG */}
                  <div className="pt-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="w-full h-16 rounded-2xl text-lg font-black bg-primary text-primary-foreground hover:shadow-2xl hover:shadow-primary/20 transition-all uppercase tracking-widest group">
                          Bayar Sekarang
                          <IconShieldCheck className="ml-2 size-6 transition-transform group-hover:scale-110" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-[2.5rem] border-border bg-card p-8">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <IconInfoCircle className="text-primary" />
                            Konfirmasi Pembayaran
                          </AlertDialogTitle>
                          <AlertDialogDescription asChild>
                            {/* Gunakan div sebagai pembungkus utama agar valid menampung p dan div lainnya */}
                            <div className="pt-4 space-y-4">
                              <p className="text-muted-foreground text-sm">
                                Harap tinjau kembali data pendaftaran Anda
                                sebelum melanjutkan ke proses pembayaran:
                              </p>

                              <div className="bg-muted/50 p-4 rounded-2xl space-y-2 border border-border/50">
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground uppercase font-bold tracking-tighter">
                                    Pendaftar:
                                  </span>
                                  <span className="text-foreground font-bold">
                                    {formData.firstName}{" "}
                                    {formData.lastName || ""}
                                  </span>
                                </div>
                                {/* ... data lainnya ... */}
                              </div>

                              <p className="text-sm font-bold text-foreground">
                                Total yang akan dibayar:{" "}
                                <span className="text-primary">
                                  Rp {total.toLocaleString()}
                                </span>
                              </p>
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="pt-6 gap-3">
                          <AlertDialogCancel className="rounded-xl h-12 border-border font-bold">
                            Kembali
                          </AlertDialogCancel>
                          <AlertDialogAction className="rounded-xl h-12 bg-primary text-primary-foreground font-black uppercase tracking-wider hover:bg-primary/90 transition-all">
                            Ya, Proses Sekarang
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>

              {/* --- KOLOM KANAN: RINGKASAN --- */}
              <aside className="lg:sticky lg:top-32 space-y-6">
                <div className="p-8 rounded-[2.5rem] border border-border bg-card shadow-2xl space-y-8">
                  <h3 className="text-lg font-bold border-b border-border pb-4 uppercase tracking-widest text-[10px]">
                    Ringkasan Pendaftaran
                  </h3>

                  <div className="flex gap-4">
                    <div className="relative size-20 rounded-2xl overflow-hidden border border-border shrink-0">
                      <Image
                        src={selectedCourse.image}
                        alt="Course"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-black leading-tight mb-1">
                        {selectedCourse.title}
                      </p>
                      <p className="text-[10px] font-bold text-primary uppercase">
                        Program Pilihan
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Biaya Pendaftaran
                      </span>
                      <span className="font-bold">
                        Rp {selectedCourse.regisFee.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        SPP Bulan Pertama
                      </span>
                      <span className="font-bold">
                        Rp {selectedCourse.sppFee.toLocaleString()}
                      </span>
                    </div>

                    <div className="pt-6 border-t border-border flex justify-between items-end">
                      <span className="text-sm font-bold">
                        Total Pembayaran
                      </span>
                      <div className="text-right">
                        <p className="text-2xl font-black text-primary tracking-tighter">
                          Rp {total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                    <IconShieldCheck size={14} className="text-primary" />
                    Verified Transaction
                  </div>
                </div>
              </aside>
            </div>
          </Container>
        </SectionWrapper>
      </main>

      <FooterSection />
    </div>
  );
}
