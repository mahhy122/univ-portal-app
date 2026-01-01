import { AppSidebar } from "@/components/app-sidebar"
import { PageHeader } from "@/components/page-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, BookOpen, Clock, TrendingUp, AlertCircle } from "lucide-react"

export default function HomePage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <PageHeader title="ホーム" description="おはようございます、田中さん" />

          <main className="flex-1 p-6">
            <div className="mx-auto max-w-7xl space-y-6">
              {/* Quick Stats */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">今日の授業</CardTitle>
                    <Calendar className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">次の授業: 10:30 データベース</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">履修単位</CardTitle>
                    <BookOpen className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18</div>
                    <p className="text-xs text-muted-foreground">今学期の合計単位数</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">出席率</CardTitle>
                    <TrendingUp className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">95%</div>
                    <p className="text-xs text-muted-foreground">良好な出席状況です</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">提出期限</CardTitle>
                    <Clock className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2</div>
                    <p className="text-xs text-muted-foreground">今週の課題</p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Today's Schedule */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>今日のスケジュール</CardTitle>
                    <CardDescription>2024年12月27日（金）</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4 rounded-lg border border-border p-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <span className="text-sm font-semibold">10:30</span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-semibold">データベース設計</h4>
                        <p className="text-sm text-muted-foreground">第3講義棟 301教室</p>
                        <p className="text-xs text-muted-foreground">山田教授</p>
                      </div>
                      <Button size="sm" variant="outline">
                        詳細
                      </Button>
                    </div>

                    <div className="flex items-start gap-4 rounded-lg border border-border p-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <span className="text-sm font-semibold">13:00</span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-semibold">ソフトウェア工学</h4>
                        <p className="text-sm text-muted-foreground">第2講義棟 205教室</p>
                        <p className="text-xs text-muted-foreground">佐藤准教授</p>
                      </div>
                      <Button size="sm" variant="outline">
                        詳細
                      </Button>
                    </div>

                    <div className="flex items-start gap-4 rounded-lg border border-border p-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <span className="text-sm font-semibold">15:00</span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-semibold">アルゴリズム演習</h4>
                        <p className="text-sm text-muted-foreground">情報処理センター PC室1</p>
                        <p className="text-xs text-muted-foreground">鈴木助教</p>
                      </div>
                      <Button size="sm" variant="outline">
                        詳細
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Notifications & Tasks */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="size-4" />
                        重要なお知らせ
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1 border-l-2 border-primary pl-3">
                        <p className="text-sm font-medium">履修登録期間終了間近</p>
                        <p className="text-xs text-muted-foreground">12月30日まで</p>
                      </div>
                      <div className="space-y-1 border-l-2 border-muted-foreground pl-3">
                        <p className="text-sm font-medium">図書館年末年始休館のお知らせ</p>
                        <p className="text-xs text-muted-foreground">12月28日～1月3日</p>
                      </div>
                      <Button variant="link" className="h-auto p-0 text-sm">
                        すべてのお知らせを見る →
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>課題・提出物</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">データベース課題</p>
                          <span className="text-xs text-destructive">明日締切</span>
                        </div>
                        <p className="text-xs text-muted-foreground">SQL課題レポート</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">ソフトウェア工学レポート</p>
                          <span className="text-xs text-muted-foreground">1週間後</span>
                        </div>
                        <p className="text-xs text-muted-foreground">アジャイル開発について</p>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent" size="sm">
                        課題一覧を見る
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
