// Each question scores toward one or more Enneagram types.
// scoring: { typeNumber: weight }
export const questions = [
  {
    id: 1,
    text: "I have high standards and feel frustrated when things aren't done correctly.",
    scoring: { 1: 3 },
  },
  {
    id: 2,
    text: "I naturally sense what people around me need and feel drawn to help them.",
    scoring: { 2: 3 },
  },
  {
    id: 3,
    text: "I work hard to succeed and care about how I come across to others.",
    scoring: { 3: 3 },
  },
  {
    id: 4,
    text: "I often feel like something important is missing from my life.",
    scoring: { 4: 3 },
  },
  {
    id: 5,
    text: "I prefer to observe and think deeply before acting or speaking.",
    scoring: { 5: 3 },
  },
  {
    id: 6,
    text: "I like to plan ahead and think through what could go wrong.",
    scoring: { 6: 3 },
  },
  {
    id: 7,
    text: "I get excited by new ideas and experiences and hate feeling limited.",
    scoring: { 7: 3 },
  },
  {
    id: 8,
    text: "I value being direct and don't shy away from confrontation when needed.",
    scoring: { 8: 3 },
  },
  {
    id: 9,
    text: "I go along with others to keep the peace and avoid conflict.",
    scoring: { 9: 3 },
  },
  {
    id: 10,
    text: "I hold myself to a strong personal code of ethics.",
    scoring: { 1: 2, 6: 1 },
  },
  {
    id: 11,
    text: "I feel guilty when I put my own needs first.",
    scoring: { 2: 2, 9: 1 },
  },
  {
    id: 12,
    text: "I adapt my personality depending on who I'm with.",
    scoring: { 3: 2, 9: 1 },
  },
  {
    id: 13,
    text: "I feel deeply and intensely — more than most people seem to.",
    scoring: { 4: 2, 2: 1 },
  },
  {
    id: 14,
    text: "I need time alone to recharge and process my thoughts.",
    scoring: { 5: 2, 4: 1 },
  },
  {
    id: 15,
    text: "I feel anxious when I don't know what to expect.",
    scoring: { 6: 2, 4: 1 },
  },
  {
    id: 16,
    text: "I tend to see the bright side and reframe negatives quickly.",
    scoring: { 7: 2, 3: 1 },
  },
  {
    id: 17,
    text: "I take charge naturally and don't like being told what to do.",
    scoring: { 8: 2, 3: 1 },
  },
  {
    id: 18,
    text: "I find it hard to say no even when I want to.",
    scoring: { 9: 2, 2: 1 },
  },
  {
    id: 19,
    text: "I notice errors and imperfections that others seem to overlook.",
    scoring: { 1: 2, 5: 1 },
  },
  {
    id: 20,
    text: "I feel most fulfilled when I know I've made a real difference to someone.",
    scoring: { 2: 2, 1: 1 },
  },
  {
    id: 21,
    text: "My accomplishments and reputation are important to how I see myself.",
    scoring: { 3: 2, 8: 1 },
  },
  {
    id: 22,
    text: "I long to be truly understood and accepted for who I really am.",
    scoring: { 4: 2, 6: 1 },
  },
  {
    id: 23,
    text: "I rarely share my inner world with others — I prefer to figure things out alone.",
    scoring: { 5: 2, 9: 1 },
  },
  {
    id: 24,
    text: "I second-guess myself and look to trusted people for reassurance.",
    scoring: { 6: 2, 2: 1 },
  },
  {
    id: 25,
    text: "I struggle with commitment because something better might come along.",
    scoring: { 7: 2, 3: 1 },
  },
  {
    id: 26,
    text: "I believe the world respects strength, and I work hard to project it.",
    scoring: { 8: 2, 3: 1 },
  },
  {
    id: 27,
    text: "I often lose track of my own wishes while focusing on everyone else's.",
    scoring: { 9: 2, 2: 1 },
  },
  {
    id: 28,
    text: "I feel restless when I'm not productive or improving something.",
    scoring: { 1: 2, 7: 1 },
  },
  {
    id: 29,
    text: "People often come to me when they need emotional support.",
    scoring: { 2: 2, 9: 1 },
  },
  {
    id: 30,
    text: "I set goals and work systematically toward them.",
    scoring: { 3: 2, 1: 1 },
  },
  {
    id: 31,
    text: "I'm drawn to art, music, poetry, or other creative expression.",
    scoring: { 4: 2, 7: 1 },
  },
  {
    id: 32,
    text: "I prefer expertise and depth over breadth and socializing.",
    scoring: { 5: 2, 1: 1 },
  },
  {
    id: 33,
    text: "I feel most secure when I have a clear plan and reliable people around me.",
    scoring: { 6: 2, 9: 1 },
  },
  {
    id: 34,
    text: "I love exploring many interests and find routine boring.",
    scoring: { 7: 2, 4: 1 },
  },
  {
    id: 35,
    text: "I stand up for people who are being treated unfairly.",
    scoring: { 8: 2, 1: 1 },
  },
  {
    id: 36,
    text: "I avoid conflict even if it means not expressing how I really feel.",
    scoring: { 9: 2, 6: 1 },
  },
];
