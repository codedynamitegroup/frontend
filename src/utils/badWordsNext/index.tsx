import BadWordsNext from "bad-words-next";
import enBadWords from "./data/enBadWords";
import viBadWords from "./data/viBadWords";

const badwordsUtils = new BadWordsNext();
badwordsUtils.add(enBadWords);
badwordsUtils.add(viBadWords);

export default badwordsUtils;
