export type StoryChapter = {
  number: string;
  year: string;
  label: string;
  title: string;
  paragraphs: string[];
};

export const storyChapters: StoryChapter[] = [
  {
    number: "01",
    year: "THE BEGINNING",
    label: "Before we knew",
    title: "Two lives, before they became one story.",
    paragraphs: [
      "Every story has a beginning, although sometimes we don't realize we are living it when it starts.",
      "Before we met, we were simply two people living our own little lives, completely unaware of how much space the other person would eventually occupy in our memories.",
    ],
  },

  {
    number: "02",
    year: "THE DAY WE MET",
    label: "A beginning we didn't recognize",
    title: "And then, somehow, there was you.",
    paragraphs: [
      "I don't know if we understood the importance of that moment when it happened.",
      "It was just another day. Another conversation. Another ordinary moment that quietly became the beginning of something extraordinary.",
      "If someone had told me then that one day I would have hundreds of memories with you, I probably wouldn't have believed them.",
    ],
  },

  {
    number: "03",
    year: "BECOMING US",
    label: "The little things",
    title: "Somewhere along the way, you became home.",
    paragraphs: [
      "Friendship didn't happen in one big moment. It happened through hundreds of tiny ones.",
      "The conversations that lasted longer than they should have. The stupid jokes that nobody else understood. The random plans. The arguments. The laughter.",
      "Without realizing it, you stopped being just someone I knew and became someone I could not imagine my story without.",
    ],
  },

  {
    number: "04",
    year: "THE YEARS",
    label: "Everything in between",
    title: "We collected moments without knowing they would become memories.",
    paragraphs: [
      "There were good days, ridiculous days, difficult days and days that neither of us probably remembers clearly anymore.",
      "But somewhere inside all of those ordinary days were the moments that mattered.",
      "Some memories are photographs. Some are conversations. Some are just a feeling that comes back whenever I think about that particular time in our lives.",
    ],
  },

  {
    number: "05",
    year: "GROWING",
    label: "Changing together",
    title: "We changed. Life changed. Somehow, we remained us.",
    paragraphs: [
      "Growing up means becoming different versions of ourselves.",
      "Our priorities changed. Our dreams changed. Life became more complicated. We entered different phases and experienced things the younger versions of us could never have imagined.",
      "But even as everything around us changed, there was still this familiar connection between us.",
    ],
  },

  {
    number: "06",
    year: "THE HARD PARTS",
    label: "Not every chapter was easy",
    title: "The story was never perfect. That's what made it real.",
    paragraphs: [
      "There were moments when things weren't easy.",
      "There were misunderstandings, silence, distance, and moments when life simply became too much.",
      "But real relationships aren't measured only by how beautiful the easy days are. Sometimes they are measured by who remains when things become difficult.",
    ],
  },

  {
    number: "07",
    year: "TODAY",
    label: "Where we are now",
    title: "Look how far we've come.",
    paragraphs: [
      "When I look back, I don't just see years passing.",
      "I see two people growing up together, making mistakes, laughing at things that probably weren't even funny, surviving difficult moments and collecting memories along the way.",
      "And somehow, after everything, here we are.",
    ],
  },
];

export const storyIntro = {
  eyebrow: "A STORY WORTH KEEPING",
  title: "Some friendships become memories.",
  highlight: "Ours became a story.",
  text: "This is not every moment we've lived. It couldn't possibly be. It is simply a place to keep the pieces that matter — the people we were, the people we became, and everything that happened in between.",
};

export const storyEnding = {
  smallText: "AND THIS ISN'T THE END",
  title: "There are still chapters left to write.",
  text: "More ordinary days. More ridiculous conversations. More photographs. More memories we don't know are memories yet.",
};
