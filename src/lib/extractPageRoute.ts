export default function extractPageRoute(input: string|null): string|null {
    if(!input) return null
    const match = input.match(/^\/([^/#]+)(?:\/|#|$)(.*)?$/);
    if (match) {
      const [, pageRoute] = match;
      return '/' + pageRoute;
    } else {
      return null;
    }
  }