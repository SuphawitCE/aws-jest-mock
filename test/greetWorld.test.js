const dayjs = require("dayjs");
const { run } = require("jest");

const greetings = () => {
  const today = dayjs();
  const hour = today.hour();
  // console.log('today: ', today, ' hour: ', hour, ' new Date() ', Date());
  if (hour >= 5 && hour < 12) {
    return "morning";
  }
  if (hour >= 12 && hour < 18) {
    return "afternoon";
  }
  if (hour >= 18 && hour < 22) {
    return "evening";
  }
  return "midnight";
};

jest.mock("dayjs");

describe("Test greetings function", () => {
  const mockDayjsHour = jest.fn();

  beforeAll(() => {
    console.log("beforeEach Effect");
    dayjs.mockImplementation(() => ({
      hour: mockDayjsHour,
    }));
  });
  afterEach(() => {
    console.log("afterEach Effect");
    jest.clearAllMocks();
  });
  // console.log('mockDayjsHour: ', mockDayjsHour);
  test("Should return morning when the time is 5:00", () => {
    const mockMorningValue = 5;
    mockDayjsHour.mockImplementation(() => mockMorningValue);
    console.log("Time: 5:00 ", greetings());
    expect(greetings()).toBe("morning");
  });

  test("Should return afternoon when the time is 12:00", () => {
    const mockAfternoonValue = 12;
    mockDayjsHour.mockImplementation(() => mockAfternoonValue);
    console.log("Time: 12:00 ", greetings());
    expect(greetings()).toBe("afternoon");
  });

  test("Shold return evening when the time is 18:00", () => {
    const mockEveningValue = 18;
    mockDayjsHour.mockImplementation(() => mockEveningValue);
    console.log("Time: 18:00 ", greetings());
    expect(greetings()).toBe("evening");
  });
});
