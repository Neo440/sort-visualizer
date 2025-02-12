# Sort Visualizer

## Overview
Sort Visualizer is an interactive web application that demonstrates sorting algorithms through dynamic visualizations. It provides both educational insights into how sorting works and engaging visual feedback through animated elements.

## Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Algorithms and Visualization](#algorithms-and-visualization)
- [How to Run](#how-to-run)
- [Project Evaluation](#project-evaluation)
- [Dev Experience](#dev-experience)
- [FAQs](#faqs)

## Project Structure

- **src/components/common/**:
  - `BarAnimator.tsx`: Handles animations for the sorting bars by listening to changes in their positions and animating movement for a fluid visual effect.
  - `BarItem.tsx`: Renders individual bars representing array elements, calculating and displaying each bar's height and style based on its value.
  - `Chevron.tsx`: Provides chevron icons used in navigation or to indicate state changes.
  - `SortingLegend.tsx`: Displays a legend that explains the color coding and state of different elements during sorting.

- **src/components/layout/**:
  - `DashboardLayout.tsx`: Defines the main layout for the dashboard.
  - **Sections/**:
    - `Bar.tsx`: Manages the display of sorting bars.
    - `CodeSection.tsx`: Shows the code associated with the currently visualized sorting algorithm.
    - `ControlBoard.tsx`: Contains interactive controls for selecting algorithms, adjusting speed, etc.
    - `VisualizerSection.tsx`: Orchestrates the overall visualization process.

- **src/components/ui/**:
  - Contains reusable UI components such as `button.tsx`, `card.tsx`, `label.tsx`, `radio-group.tsx`, `slider.tsx`, and `tabs.tsx` for consistency across the application.

- **src/lib/**:
  - `arrayUtils.ts`: Provides utility functions for array manipulation, including implementations of sorting algorithms.
  - `codeParser.ts`: Parses code for display, enhancing the educational experience by showing formatted code snippets.
  - `utils.ts`: Contains general helper functions used throughout the project.

- **src/pages/**:
  - `_app.tsx` & `_document.tsx`: Set up global configurations and document structure for the Next.js application.
  - `index.tsx`: Serves as the main entry point for the application.

- **src/styles/**:
  - `globals.css`: Holds global CSS rules to maintain a consistent design across all components.

## Algorithms and Visualization

### Bubble Sort

- **Description:** Repeatedly traverses the array to compare adjacent elements, swapping them if they are out of order until the array is sorted.
- **Code Reference:** Look for the `bubbleSort` function in `src/lib/arrayUtils.ts`.
- **Visualization Flow (Bubble Sort Example):**
  1. **Initialization:** The unsorted array is represented as bars using the `BarItem.tsx` component.
  2. **Comparison & Swap:** Adjacent bars are compared. If a bar is taller than its neighbor, they are swapped, with the `BarAnimator.tsx` animating this transition.
  3. **Iteration:** This process repeats until the array is fully sorted.
- **Example Code:**

```typescript
function bubbleSort(arr: number[]): number[] {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
```

### Quick Sort

- **Description:** Employs a divide-and-conquer strategy by partitioning the array around a pivot element, then recursively sorting the subarrays.
- **Code Reference:** See the `quickSort` function in `src/lib/arrayUtils.ts`.
- **Visualization Flow:**
  1. **Partitioning:** The array is partitioned into subarrays based on a chosen pivot.
  2. **Recursive Sorting:** Each partition is sorted recursively, with animations illustrating the breakdown process.
- **Example Code:**

```typescript
function quickSort(arr: number[]): number[] {
  if (arr.length < 2) return arr;
  const pivot = arr[0];
  const lesser = arr.slice(1).filter(x => x <= pivot);
  const greater = arr.slice(1).filter(x => x > pivot);
  return quickSort(lesser).concat(pivot, quickSort(greater));
}
```

## How to Run

1. **Install Dependencies:** Make sure Node.js is installed, then run:
   ```bash
   npm install
   ```
2. **Start the Development Server:** Execute:
   ```bash
   npm run dev
   ```
3. **Access the Application:** Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the Sort Visualizer.

## Project Evaluation

### Strengths
- **Modular Architecture:** Clear separation of components, utilities, pages, and styles simplifies maintenance and extension.
- **Interactive Visualization:** Engaging animations and clear data representation enhance user experience and educational value.
- **Educational Value:** Detailed code explanations and visualizations effectively illustrate sorting algorithm concepts.

### Weaknesses
- **Scalability Concerns:** The current implementation may face performance or clarity issues with large datasets or more complex algorithms.
- **Code Consistency:** Some components and utilities could benefit from additional refactoring to enhance readability and reduce redundancy.
- **Limited Error Handling:** Robust error checking and management could be improved within animation and sorting logic.

### Overall Code Quality
The codebase is well-structured with a clear separation of concerns. It is effective for educational purposes, though there is room for improvements in scalability, code consistency, and error management. With targeted refactoring, the project's performance and maintainability could be further enhanced.

## Dev Experience

- **Development Environment:** We recommend using Visual Studio Code with extensions for JavaScript/TypeScript, ESLint, and Prettier for a streamlined development experience.
- **Version Control:** The project uses Git for version control. Please follow conventional commit messages and branching strategies.
- **Hot Reload:** Thanks to Next.js, changes in the code are reflected in real-time during development, which accelerates iterative testing and debugging.
- **Testing:** Although basic tests are in place, consider adding more comprehensive tests to ensure code robustness as the project evolves.
- **Debugging:** Utilize the browser's developer tools along with VS Code’s debugging features to troubleshoot and optimize the code.

## FAQs

**Q: How do I install dependencies?**

A: Run `npm install` in the project directory.

**Q: How do I start the development server?**

A: Execute `npm run dev` and navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

**Q: What sorting algorithms are implemented?**

A: The project currently includes Bubble Sort and Quick Sort, which demonstrate the sorting process with animations.

**Q: How can I contribute to this project?**

A: Fork the repository, create a feature branch, commit your changes, and submit a pull request. Please follow the project's coding standards and commit guidelines.

**Q: Where can I find more information about the project?**

A: The project documentation, including this README and inline code comments, provides details about the architecture, algorithms, and design patterns used.

Happy Sorting!