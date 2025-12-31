"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { PageHeader } from "@/components/page-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Star, ExternalLink } from "lucide-react"
import { useState } from "react"

type ClassInfo = {
  subject: string
  room: string
  teacher: string
  category: string
  credits: number
  assignments: number
  rating: number
  syllabusUrl: string
}

const timetableData: Record<string, Record<number, ClassInfo | null>> = {
  月: {
    1: {
      subject: "プログラミング基礎",
      room: "A101",
      teacher: "田中教授",
      category: "専門必修",
      credits: 2,
      assignments: 3,
      rating: 4.5,
      syllabusUrl: "https://syllabus.example.ac.jp/courses/prog-basic",
    },
    2: {
      subject: "データ構造",
      room: "A101",
      teacher: "田中教授",
      category: "専門必修",
      credits: 2,
      assignments: 5,
      rating: 4.2,
      syllabusUrl: "https://syllabus.example.ac.jp/courses/data-structure",
    },
    3: null,
    4: {
      subject: "線形代数",
      room: "B205",
      teacher: "佐藤教授",
      category: "基礎必修",
      credits: 2,
      assignments: 2,
      rating: 3.8,
      syllabusUrl: "https://syllabus.example.ac.jp/courses/linear-algebra",
    },
    5: null,
  },
  火: {
    1: {
      subject: "英語Ⅰ",
      room: "C304",
      teacher: "Smith先生",
      category: "教養必修",
      credits: 1,
      assignments: 4,
      rating: 4.7,
      syllabusUrl: "https://syllabus.example.ac.jp/courses/english-1",
    },
    2: {
      subject: "英語Ⅰ",
      room: "C304",
      teacher: "Smith先生",
      category: "教養必修",
      credits: 1,
      assignments: 4,
      rating: 4.7,
      syllabusUrl: "https://syllabus.example.ac.jp/courses/english-1",
    },
    3: {
      subject: "物理学",
      room: "D102",
      teacher: "山田教授",
      category: "基礎必修",
      credits: 2,
      assignments: 1,
      rating: 3.5,
      syllabusUrl: "https://syllabus.example.ac.jp/courses/physics",
    },
    4: {
      subject: "物理学実験",
      room: "D実験室",
      teacher: "山田教授",
      category: "基礎必修",
      credits: 1,
      assignments: 8,
      rating: 4.0,
      syllabusUrl: "https://syllabus.example.ac.jp/courses/physics-lab",
    },
    5: null,
  },
  水: {
    1: null,
    2: {
      subject: "アルゴリズム",
      room: "A103",
      teacher: "鈴木教授",
      category: "専門必修",
      credits: 2,
      assignments: 6,
      rating: 4.6,
      syllabusUrl: "https://syllabus.example.ac.jp/courses/algorithm",
    },
    3: {
      subject: "アルゴリズム",
      room: "A103",
      teacher: "鈴木教授",
      category: "専門必修",
      credits: 2,
      assignments: 6,
      rating: 4.6,
      syllabusUrl: "https://syllabus.example.ac.jp/courses/algorithm",
    },
    4: {
      subject: "体育",
      room: "体育館",
      teacher: "高橋先生",
      category: "教養必修",
      credits: 1,
      assignments: 0,
      rating: 4.8,
      syllabusUrl: "https://syllabus.example.ac.jp/courses/pe",
    },
    5: null,
  },
  木: {
    1: {
      subject: "データベース",
      room: "A102",
      teacher: "伊藤教授",
      category: "専門選択",
      credits: 2,
      assignments: 4,
      rating: 4.3,
      syllabusUrl: "https://syllabus.example.ac.jp/courses/database",
    },
    2: {
      subject: "データベース",
      room: "A102",
      teacher: "伊藤教授",
      category: "専門選択",
      credits: 2,
      assignments: 4,
      rating: 4.3,
      syllabusUrl: "https://syllabus.example.ac.jp/courses/database",
    },
    3: {
      subject: "経済学",
      room: "E201",
      teacher: "渡辺教授",
      category: "教養選択",
      credits: 2,
      assignments: 2,
      rating: 3.9,
      syllabusUrl: "https://syllabus.example.ac.jp/courses/economics",
    },
    4: null,
    5: null,
  },
  金: {
    1: {
      subject: "Web技術",
      room: "A104",
      teacher: "中村教授",
      category: "専門選択",
      credits: 2,
      assignments: 7,
      rating: 4.4,
      syllabusUrl: "https://syllabus.example.ac.jp/courses/web-tech",
    },
    2: {
      subject: "Web技術",
      room: "A104",
      teacher: "中村教授",
      category: "専門選択",
      credits: 2,
      assignments: 7,
      rating: 4.4,
      syllabusUrl: "https://syllabus.example.ac.jp/courses/web-tech",
    },
    3: null,
    4: {
      subject: "ゼミナール",
      room: "F301",
      teacher: "田中教授",
      category: "専門必修",
      credits: 2,
      assignments: 10,
      rating: 4.9,
      syllabusUrl: "https://syllabus.example.ac.jp/courses/seminar",
    },
    5: {
      subject: "ゼミナール",
      room: "F301",
      teacher: "田中教授",
      category: "専門必修",
      credits: 2,
      assignments: 10,
      rating: 4.9,
      syllabusUrl: "https://syllabus.example.ac.jp/courses/seminar",
    },
  },
  土: {
    1: {
      subject: "情報倫理",
      room: "E101",
      teacher: "小林教授",
      category: "教養必修",
      credits: 2,
      assignments: 1,
      rating: 4.1,
      syllabusUrl: "https://syllabus.example.ac.jp/courses/info-ethics",
    },
    2: null,
    3: null,
    4: null,
    5: null,
  },
}

const periods = [
  { period: 1, time: "09:00 - 10:30" },
  { period: 2, time: "10:40 - 12:10" },
  { period: 3, time: "13:00 - 14:30" },
  { period: 4, time: "14:40 - 16:10" },
  { period: 5, time: "16:20 - 17:50" },
]

const days = ["月", "火", "水", "木", "金", "土"]

export default function SchedulePage() {
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleClassClick = (classInfo: ClassInfo) => {
    setSelectedClass(classInfo)
    setIsDialogOpen(true)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <PageHeader title="時間割" description="今学期の授業スケジュール" />

          <main className="flex-1 p-6">
            <div className="mx-auto max-w-7xl space-y-6">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-4 text-left font-medium text-sm min-w-[100px]">時限 / 曜日</th>
                          {days.map((day) => (
                            <th key={day} className="p-4 text-center font-medium text-sm min-w-[140px]">
                              {day}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {periods.map((period) => (
                          <tr key={period.period} className="border-b">
                            <td className="p-4 bg-muted/30">
                              <div className="font-semibold">{period.period}限</div>
                              <div className="text-xs text-muted-foreground mt-1">{period.time}</div>
                            </td>
                            {days.map((day) => {
                              const classInfo = timetableData[day][period.period]

                              return (
                                <td key={`${day}-${period.period}`} className="p-2 text-center align-top">
                                  {classInfo ? (
                                    <div
                                      className="bg-primary/10 rounded-lg p-3 h-full hover:bg-primary/20 transition-colors cursor-pointer"
                                      onClick={() => handleClassClick(classInfo)}
                                    >
                                      <div className="font-semibold text-sm mb-1">{classInfo.subject}</div>
                                      <Badge variant="secondary" className="text-xs mb-1">
                                        {classInfo.room}
                                      </Badge>
                                      <div className="text-xs text-muted-foreground">{classInfo.teacher}</div>
                                    </div>
                                  ) : (
                                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                                      -
                                    </div>
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">今日の授業</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="font-semibold">1限</div>
                        <div className="flex-1">
                          <div className="font-medium">プログラミング基礎</div>
                          <div className="text-sm text-muted-foreground">A101 / 田中教授</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="font-semibold">2限</div>
                        <div className="flex-1">
                          <div className="font-medium">データ構造</div>
                          <div className="text-sm text-muted-foreground">A101 / 田中教授</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">次の授業</h3>
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge>4限 14:40開始</Badge>
                        <span className="text-sm text-muted-foreground">残り2時間</span>
                      </div>
                      <div className="font-semibold text-lg mb-1">線形代数</div>
                      <div className="text-sm text-muted-foreground">B205 / 佐藤教授</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedClass?.subject}</DialogTitle>
            <DialogDescription>授業詳細情報</DialogDescription>
          </DialogHeader>

          {selectedClass && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">教員名</div>
                  <div className="text-base font-semibold">{selectedClass.teacher}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">授業区分</div>
                  <Badge variant="outline" className="w-fit">
                    {selectedClass.category}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">単位数</div>
                  <div className="text-base font-semibold">{selectedClass.credits}単位</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">授業教室</div>
                  <div className="text-base font-semibold">{selectedClass.room}</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">課題数</div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-primary">{selectedClass.assignments}</div>
                  <div className="text-sm text-muted-foreground">件</div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <div className="text-sm font-medium text-muted-foreground">授業評価</div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.floor(selectedClass.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : star - 0.5 <= selectedClass.rating
                              ? "fill-yellow-400/50 text-yellow-400"
                              : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-lg font-bold">{selectedClass.rating.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">/ 5.0</div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <div className="text-sm font-medium text-muted-foreground">シラバス</div>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-transparent"
                  onClick={() => window.open(selectedClass.syllabusUrl, "_blank")}
                >
                  <span>シラバスを表示</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
