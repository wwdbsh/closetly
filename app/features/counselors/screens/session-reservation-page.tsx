import { Button } from "~/core/components/ui/button";
import { Input } from "~/core/components/ui/input";
import { Textarea } from "~/core/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/core/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/core/components/ui/card";
import { DatePicker } from "~/core/components/ui/DatePicker";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "~/core/components/ui/toggle-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/core/components/ui/dialog";
import { BlurFade } from "components/magicui/blur-fade";

export default function SessionReservationPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [place, setPlace] = useState("");
  const [situations, setSituations] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);

  const timeSlots = [
    { time: "09:00", available: true },
    { time: "09:30", available: false },
    { time: "10:00", available: true },
    { time: "10:30", available: true },
    { time: "11:00", available: true },
    { time: "11:30", available: true },
    { time: "12:00", available: true },
    { time: "12:30", available: true },
    { time: "13:00", available: false },
    { time: "13:30", available: false },
    { time: "14:00", available: true },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "15:30", available: false },
    { time: "16:00", available: false },
    { time: "16:30", available: false },
    { time: "17:00", available: true },
    { time: "17:30", available: true },
    { time: "18:00", available: true },
    { time: "18:30", available: true },
    { time: "19:00", available: true },
    { time: "19:30", available: true },
    { time: "20:00", available: false },
    { time: "20:30", available: true },
    { time: "21:00", available: false },
  ];

  // 상황, 증상 상수 배열 추가
  const SITUATION_OPTIONS = [
    "대인관계", "따돌림", "취업/진로", "육아/출산",
    "부부관계", "이혼", "성생활", "학업",
    "고시", "학교생활", "외모", "정신건강",
    "신체건강", "기타"
  ];
  const SYMPTOM_OPTIONS = [
    "우울", "스트레스", "화병", "불안",
    "조울증", "PTSD", "콤플렉스", "자존감",
    "자해", "분노조절", "외로움", "대인기피",
    "무기력", "ADHD", "섭식문제", "기타"
  ];

  return (
    
    <div className="w-full min-h-screen flex flex-col items-center justify-center py-8">
      <BlurFade>
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>상담 예약</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">상담 날짜</label>
                <DatePicker value={date} onChange={setDate} placeholder="상담 날짜를 선택하세요" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">상담 시간</label>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="justify-start"
                    >
                      {selectedTime ? selectedTime : "상담 시간 선택"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-full max-w-none py-7 justify-center">
                    <DialogHeader>
                      <DialogTitle>상담 시간 선택</DialogTitle>
                    </DialogHeader>
                    <ToggleGroup
                      type="single"
                      value={selectedTime ?? undefined}
                      onValueChange={val => {
                        setSelectedTime(val);
                        if (val) setOpen(false);
                      }}
                      className="grid grid-cols-5 gap-2"
                    >
                      {timeSlots.map(slot => (
                        <ToggleGroupItem
                          key={slot.time}
                          value={slot.time}
                          disabled={!slot.available}
                          className={[
                            "border rounded-md min-w-[64px] px-3 py-2 text-sm font-medium transition-colors duration-150",
                            slot.available
                              ? (selectedTime === slot.time
                                  ? "bg-[#39e75f] border-[#39e75f] text-white hover:bg-[#39e75f] hover:border-[#39e75f] cursor-pointer"
                                  : "bg-white border-gray-300 text-gray-900 hover:bg-gray-100 hover:border-[#39e75f] cursor-pointer")
                              : "bg-white border-[#FF746C] text-gray-300 opacity-60 cursor-not-allowed"
                          ].join(" ")}
                        >
                          {slot.time}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </DialogContent>
                </Dialog>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">상담 방식</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="상담 방식을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chat">채팅</SelectItem>
                    <SelectItem value="phone">전화</SelectItem>
                    <SelectItem value="visit">방문</SelectItem>
                    <SelectItem value="video">화상</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="my-6">
                <h3 className="text-base font-semibold mb-1">상담 내용 선택</h3>
                <div className="text-xs text-gray-400 mb-2">
                  내용 선택 없이 즉시 예약을 원하시면 하단의 “예약하기” 버튼을 눌러주세요. <br />
                  예약 후 수정 가능합니다.
                </div>
                {/* 나이, 성별, 장소 (한 줄로) */}
                <div className="mb-4 flex gap-2">
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-semibold mb-1">나이</label>
                    <Select value={age} onValueChange={setAge}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="나이" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10-19">10~19세</SelectItem>
                        <SelectItem value="20-29">20~29세</SelectItem>
                        <SelectItem value="30-39">30~39세</SelectItem>
                        <SelectItem value="40-49">40~49세</SelectItem>
                        <SelectItem value="50-59">50~59세</SelectItem>
                        <SelectItem value="60+">60세 이상</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-semibold mb-1">성별</label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="성별" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">남</SelectItem>
                        <SelectItem value="female">여</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-semibold mb-1">장소</label>
                    <Select value={place} onValueChange={setPlace}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="장소" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="work">직장</SelectItem>
                        <SelectItem value="school">학교</SelectItem>
                        <SelectItem value="home">가정</SelectItem>
                        <SelectItem value="relationship">연애</SelectItem>
                        <SelectItem value="myself">자아(본인)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* 상황 (복수 선택) */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">상황</label>
                  <ToggleGroup type="multiple" value={situations} onValueChange={setSituations} className="grid grid-cols-4 md:grid-cols-5 gap-2">
                    {SITUATION_OPTIONS.map(option => (
                      <ToggleGroupItem
                        key={option}
                        value={option}
                        className={[
                          "border rounded-md min-w-[64px] px-3 py-2 text-sm font-normal transition-colors duration-150",
                          situations.includes(option)
                            ? "!bg-[#0C284F] !text-white hover:!bg-gray-100 hover:!text-[#393939] cursor-pointer"
                            : "bg-white text-gray-900 cursor-pointer"
                        ].join(" ")}
                      >
                        {option}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
                
                {/* 증상 (복수 선택) */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">증상</label>
                  <ToggleGroup type="multiple" value={symptoms} onValueChange={setSymptoms} className="grid grid-cols-4 md:grid-cols-5 gap-2">
                    {SYMPTOM_OPTIONS.map(option => (
                      <ToggleGroupItem
                        key={option}
                        value={option}
                        className={[
                          "border rounded-md min-w-[64px] px-3 py-2 text-sm font-normal transition-colors duration-150",
                          symptoms.includes(option)
                            ? "!bg-[#0C284F] !text-white hover:!bg-gray-100 hover:!text-[#393939] cursor-pointer"
                            : "bg-white text-gray-900 cursor-pointer"
                        ].join(" ")}
                      >
                        {option}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">상담 내용</label>
                  <Textarea rows={4} placeholder="상담받고 싶은 내용을 입력해 주세요." />
                </div>
              </div>
              <Button type="submit" className="mt-4 w-full">예약하기</Button>
            </form>
          </CardContent>
        </Card>
      </BlurFade>
    </div>
  );
} 