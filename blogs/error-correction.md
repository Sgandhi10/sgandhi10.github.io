# Inspiration
The past few weeks my a coworker of mine has been posing different 
challenge problems as a way to explore different ways of thinking. The first 
question posed was a simple but help to start the conversation.  

*Question 1: Given an array of numbers from 1 to N-1 with one element removed 
determine the missing element. Treat the array as a blackbox of sorts where 
only signals can be computed within with respect to all the elements and sent 
out. You only cyclists know the signals you create along with N.*

This question is fairly straight forward if you take some time to think 
about it and can be solved utilizing quite a few different techniques. I 
implore you to challenge your self and see how this question could be 
approached utilizing just logic gates. Think more from a hardware standpoint 
and the solution will be quite elegant ([Solution](#question-1)).

After exploring this question, I was posed with the second part of this 
question. Now what happens if we remove two elements instead of just one. 
This question complicates things since a simplistic view that we used in the 
previous question no longer works. We must utilize a more complicated 
approach but still we are able to come up with fairly elegant solution. I 
again implore you to come up with a solution from the perspective of logic 
gates. ([Solution](#question-2))

These questions got me thinking about error correction. In my day to work I 
am constantly talking about error correction codes (ECC) and forward error 
correction (FEC) using algorithms such as Hamming Codes, and Reed-Solemn. 
While the challenge questions are nowhere near as sophisticated as these 
algorithms they got me thinking in a sense they are quite similar. These 
algorithms require extra bits of data to be sent which are utilized 
determine the errors, and in the challenge questions we are utilizing 
signals that we create. These signals are then sent along with the data and 
using the original computed value along with the computed value from 
received data to some degree we are able to determine whether an error has 
occurred and potentially recover the original data. 

# Introduction
The basics of error correction is the addition of a certain number of bits 
to allow for additional redundancy with data being sent. The purpose of 
error correction codes is not to completely eliminate the possibility of an 
error happening, but rather reduce the number of errors based on the 
requirements of the system.

# Hamming Codes
Hamming codes were one of the first error correction codes ever created. The 
idea of Hamming codes is quite straight forward and based around two 
concepts: parity bits and binary search.  

<div style="display: flex; justify-content: center; margin: 3rem 0;">
  <table style="border-collapse: collapse; text-align: center; border: 2px solid var(--card-border);">
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:var(--accent); font-weight: bold; font-size: 1.1em;">X₀</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:#10B981; font-weight: bold; font-size: 1.1em;">X₁</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:#10B981; font-weight: bold; font-size: 1.1em;">X₂</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:var(--text-main); font-size: 1.1em;">0₃</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:#10B981; font-weight: bold; font-size: 1.1em;">X₄</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:var(--text-main); font-size: 1.1em;">0₅</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:var(--text-main); font-size: 1.1em;">1₆</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:var(--text-main); font-size: 1.1em;">1₇</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:#10B981; font-weight: bold; font-size: 1.1em;">X₈</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:var(--text-main); font-size: 1.1em;">0₉</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:var(--text-main); font-size: 1.1em;">1₁₀</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:var(--text-main); font-size: 1.1em;">0₁₁</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:var(--text-main); font-size: 1.1em;">1₁₂</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:var(--text-main); font-size: 1.1em;">1₁₃</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:var(--text-main); font-size: 1.1em;">1₁₄</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:var(--text-main); font-size: 1.1em;">0₁₅</span></td>
    </tr>
  </table>
</div>

A Hamming code consists of primarily two different elements: data bits and parity bits. The parity bits are located at the powers of two which will shortly make sense why. The idea of this error correction code is to do parities for subgroups and by determining which subgroups have errors you can isolate which cell has the error (binary search).

<div style="display: flex; flex-direction: row; justify-content: center; align-items: flex-start; gap: 40px; flex-wrap: wrap; margin: 3rem 0;">

  <!-- Group 1 (P1): Covers 1, 3, 5, 7, 9, 11, 13, 15 -->
  <table style="border-collapse: collapse; text-align: center; border: 2px solid var(--card-border);">
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₀</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--accent); font-weight: bold; font-size: 0.85em;">X₁</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₂</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">0₃</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₄</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">0₅</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">1₆</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">1₇</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₈</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">0₉</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">1₁₀</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">0₁₁</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">1₁₂</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₃</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">1₁₄</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">0₁₅</span></td>
    </tr>
  </table>

  <!-- Group 2 (P2): Covers 2, 3, 6, 7, 10, 11, 14, 15 -->
  <table style="border-collapse: collapse; text-align: center; border: 2px solid var(--card-border);">
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₀</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₁</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--accent); font-weight: bold; font-size: 0.85em;">X₂</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">0₃</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₄</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">0₅</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">1₆</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">1₇</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₈</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">0₉</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₀</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">0₁₁</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">1₁₂</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">1₁₃</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₄</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">0₁₅</span></td>
    </tr>
  </table>

  <!-- Group 3 (P4): Covers 4, 5, 6, 7, 12, 13, 14, 15 -->
  <table style="border-collapse: collapse; text-align: center; border: 2px solid var(--card-border);">
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₀</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₁</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₂</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">0₃</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--accent); font-weight: bold; font-size: 0.85em;">X₄</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">0₅</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">1₆</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">1₇</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₈</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">0₉</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">1₁₀</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">0₁₁</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₂</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₃</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₄</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">0₁₅</span></td>
    </tr>
  </table>

  <!-- Group 4 (P8): Covers 8, 9, 10, 11, 12, 13, 14, 15 -->
  <table style="border-collapse: collapse; text-align: center; border: 2px solid var(--card-border);">
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₀</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₁</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₂</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">0₃</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₄</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">0₅</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">1₆</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">1₇</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--accent); font-weight: bold; font-size: 0.85em;">X₈</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">0₉</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₀</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">0₁₁</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₂</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₃</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₄</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: var(--accent-bg);"><span style="color:var(--text-main); font-size: 0.85em;">0₁₅</span></td>
    </tr>
  </table>

</div>



# Reed-Solemn


# Challenge Question Solutions
## Question 1
There are a couple of different approaches for this question.   
### Solution 1
The first solution is summing the expected array and subtracting it from the 
received array. The subtraction of the two will provide the value that is 
missing.
$$
\begin{aligned}
S_{expected} &= \frac{n(n+1)}{2} \\
S_{actual}   &= \sum_{i=1}^{n-1} a_i \\
d            &= S_{expected} - S_{actual}
\end{aligned}
$$

### Solution 2
This solution follows the same ideas as the first solution but is approached 
from a logic gate perspective. In hardware there is one particular gate that 
allows us to determine if there is a difference between two numbers (xor). 
If we utilize this gate and xor each number in the expected array and on the 
received array separately we should get a unique output which can then be 
used to determine the missing number by XORing.

$$
\begin{aligned}
X_{expected} &= \bigoplus_{i=1}^{N} i = i_1 \oplus i_1 \oplus i_2 ... i_
{N-1} \oplus i_N\\
X_{actual}   &= \bigoplus_{i=1}^{N-1} a_i \\
d            &= X_{expected} \oplus X_{actual}
\end{aligned}
$$

To better highlight what is going on I have provided a simple example below 
where N = 5 and 3 is the missing element.  
$$
\begin{aligned}
\text{Expected: } X_{exp} &= 3'b001 \oplus 3'b010 \oplus 3'b011 \oplus 3'b100 \oplus 3'b101 \\
&= 3'b001 \\
\text{Actual: } X_{act}   &= 3'b001 \oplus 3'b010 \oplus 3'b100 \oplus 3'b101 \\
&= 3'b010 \\
\hline
\text{Dropped: } d       &= X_{exp} \oplus X_{act} \\
&= 3'b001 \oplus 3'b010 \\
&= 3'b011
\end{aligned}
$$

## Question 2


*Disclaimer: Gemini and ChatGPT were utilized for the purpose of research 
only*
