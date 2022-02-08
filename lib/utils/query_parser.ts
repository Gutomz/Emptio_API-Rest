export function parseSearch(search: string, indexes: string[]) {
  if (!search) return {};

  const words = search.split(" ");

  let elements: any[] = []

  for (var wrd_index in words) {
    const word = words[wrd_index];

    for (var idx_index in indexes) {
      const index: string = indexes[idx_index];

      let newEnter: { [key: string]: any } = {};
      newEnter[index] = { $regex: word, $options: 'ix' };

      elements.push(newEnter);
    }
  }

  return {
    $or: elements
  };
}
