import { Box } from "@mui/material";
import TextEditor from "components/editor/TextEditor";
import React, { useState } from "react";
import classes from "./styles.module.scss";
import Heading3 from "components/text/Heading3";

type Props = {};

const ProblemDetailDescription = (props: Props) => {
  const [description, setDescription] = useState<string>(`
	<div class="elfjS" data-track-load="description_content"><p>Given a signed 32-bit integer <code>x</code>, return <code>x</code><em> with its digits reversed</em>. If reversing <code>x</code> causes the value to go outside the signed 32-bit integer range <code>[-2<sup>31</sup>, 2<sup>31</sup> - 1]</code>, then return <code>0</code>.</p>

	<p><strong>Assume the environment does not allow you to store 64-bit integers (signed or unsigned).</strong></p>
	
	<p>&nbsp;</p>
	<p><strong class="example">Example 1:</strong></p>
	
	<pre><strong>Input:</strong> x = 123
	<strong>Output:</strong> 321
	</pre>
	
	<p><strong class="example">Example 2:</strong></p>
	
	<pre><strong>Input:</strong> x = -123
	<strong>Output:</strong> -321
	</pre>
	
	<p><strong class="example">Example 3:</strong></p>
	
	<pre><strong>Input:</strong> x = 120
	<strong>Output:</strong> 21
	</pre>
	
	<p>&nbsp;</p>
	<p><strong>Constraints:</strong></p>
	
	<ul>
		<li><code>-2<sup>31</sup> &lt;= x &lt;= 2<sup>31</sup> - 1</code></li>
	</ul>
	</div>
	`);

  return (
    <Box id={classes.introduction}>
      <Box id={classes.courseDescription}>
        <Heading3>Reverse Integer</Heading3>
        <TextEditor value={description} onChange={setDescription} readOnly={true} />
      </Box>
    </Box>
  );
};

export default ProblemDetailDescription;
