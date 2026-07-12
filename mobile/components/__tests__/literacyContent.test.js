// Render smoke tests for the media-literacy content: the onboarding figures,
// the result screen's "why this can be wrong" card, and the category cards'
// explainer-only teaching fields. These are content components with no logic
// to unit-test — the point is that they mount without throwing and that the
// explainer/measurement split holds (tell/example never leak onto the result
// screen's data cards).
import renderer, { act } from "react-test-renderer";
import { ThemeProvider } from "../../context/ThemeContext";
import CategoryCard from "../ui/CategoryCard";
import LimitationsCard from "../ui/LimitationsCard";
import OnboardingFigure from "../ui/OnboardingFigure";
import { CATEGORIES } from "../../lib/categories";

function renderWithTheme(element) {
  let tree;
  act(() => {
    tree = renderer.create(<ThemeProvider>{element}</ThemeProvider>);
  });
  const text = JSON.stringify(tree.toJSON());
  act(() => tree.unmount());
  return text;
}

describe("OnboardingFigure", () => {
  it.each(["consensus", "crowd", "magnifier"])(
    "renders the %s line-art figure",
    (kind) => {
      expect(() =>
        renderWithTheme(<OnboardingFigure kind={kind} />)
      ).not.toThrow();
    }
  );

  it("renders the stat variant with numeral and caption", () => {
    const text = renderWithTheme(
      <OnboardingFigure
        kind="stat"
        stat="9–15%"
        caption="VAROL ET AL., 2017 [1]"
      />
    );
    expect(text).toContain("9–15%");
    expect(text).toContain("VAROL ET AL., 2017 [1]");
  });
});

describe("LimitationsCard", () => {
  it("covers short comments, second-language writing, and copied-but-genuine text", () => {
    const text = renderWithTheme(<LimitationsCard />);
    expect(text).toContain("WHY THIS SCORE CAN BE WRONG");
    expect(text).toContain("A short comment isn't a bot comment.");
    expect(text).toContain("second language");
    expect(text).toContain("Copied text isn't always coordination.");
    expect(text).toContain("not a verdict on any individual commenter");
  });
});

describe("CategoryCard teaching fields", () => {
  const category = CATEGORIES.find((c) => c.key === "low_effort");

  it("shows example and tell in explainer mode (no percent)", () => {
    const text = renderWithTheme(
      <CategoryCard
        categoryKey={category.key}
        stamp={category.stamp}
        label={category.label}
        description={category.description}
        example={category.example}
        tell={category.tell}
      />
    );
    expect(text).toContain("THE TELL");
    expect(text).toContain(category.example);
  });

  it("hides example and tell when rendering measurements", () => {
    const text = renderWithTheme(
      <CategoryCard
        categoryKey={category.key}
        stamp={category.stamp}
        label={category.label}
        description={category.description}
        example={category.example}
        tell={category.tell}
        percent={25}
      />
    );
    expect(text).not.toContain("THE TELL");
    expect(text).not.toContain(category.example);
  });

  it("every category defines a description, example, and tell", () => {
    for (const c of CATEGORIES) {
      expect(typeof c.description).toBe("string");
      expect(c.example.length).toBeGreaterThan(0);
      expect(c.tell.length).toBeGreaterThan(0);
    }
  });
});
