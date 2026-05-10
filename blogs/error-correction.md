# Inspiration

The past few weeks, a coworker of mine has been posing different challenge
problems as a way to explore different ways of thinking. The first question
posed was simple but helped start the conversation.

*Question 1: Given an array of numbers from 1 to N-1 with one element removed,
determine the missing element. Treat the array as a blackbox of sorts, where
signals can only be computed within with respect to all elements and then sent
out. You only know the signals you create along with N.*

This question is fairly straightforward if you take some time to think about it,
and it can be solved using several different techniques. I implore you to
challenge yourself and see how this question could be approached using just
logic gates. Think from a hardware standpoint, and the solution will be quite
elegant ([Solution](#question-1)).

After exploring this question, I was posed with the second part: now, what
happens if we remove two elements instead of just one? This question complicates
things, as the simplistic view we used previously no longer works. We must
utilize a more complicated approach, but we are still able to come up with a
fairly elegant solution. Again, I implore you to come up with a solution from
the perspective of logic gates ([Solution](#question-2)).

These questions got me thinking about error correction. In my day-to-day work, I
am constantly talking about error correction codes (ECC) and forward error
correction (FEC), using algorithms such as Hamming Codes and Reed-Solomon. While
the challenge questions are nowhere near as sophisticated as these algorithms,
they got me thinking; in a sense, they are quite similar. These algorithms
require extra bits of data to be sent, which are used to determine errors.
Similarly, in the challenge questions, we are utilizing signals that we create.
These signals are sent along with the data; by comparing the original computed
value with the value from the received data, we can determine whether an error
has occurred and potentially recover the original data.

# Hamming Codes

Hamming codes were one of the first error correction codes ever created. The
idea behind Hamming codes is quite straightforward and is based on two concepts:
even parity bits (even number of ones) and binary search (reduce search 
space by half with each step). There is a third concept I will discuss 
later, which is part of the idea for extended Hamming codes.

<div style="display: flex; justify-content: center; margin: 3rem 0;">
  <table style="border-collapse: collapse; text-align: center; border: 2px solid var(--card-border);">
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:var(--accent); font-weight: bold; font-size: 1.1em;">X₀</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:#10B981; font-weight: bold; font-size: 1.1em;">X₁</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:#F59E0B; font-weight: bold; font-size: 1.1em;">X₂</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:var(--text-main); font-size: 1.1em;">0₃</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:#8B5CF6; font-weight: bold; font-size: 1.1em;">X₄</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:var(--text-main); font-size: 1.1em;">0₅</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:var(--text-main); font-size: 1.1em;">1₆</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:var(--text-main); font-size: 1.1em;">1₇</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:#EC4899; font-weight: bold; font-size: 1.1em;">X₈</span></td>
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

The even parity bits are located at powers of two and split the matrix into 
subgroups. The idea behind this error correction code is to perform
create even parties for subgroups; by determining which subgroups have errors, 
you can isolate which cell contains the error (similar to a binary search).

### Even Parity Subgroups
<div style="display: flex; flex-direction: row; justify-content: center; align-items: flex-start; gap: 40px; flex-wrap: wrap; margin: 3rem 0;">

  <!-- Group 1 (P1): Covers 1, 3, 5, 7, 9, 11, 13, 15 -->
  <table style="border-collapse: collapse; text-align: center; border: 2px solid var(--card-border);">
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₀</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(16, 185, 129, 0.15);"><span style="color:#10B981; font-weight: bold; font-size: 0.85em;">X₁</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₂</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(16, 185, 129, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">0₃</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₄</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(16, 185, 129, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">0₅</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">1₆</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(16, 185, 129, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">1₇</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₈</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(16, 185, 129, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">0₉</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">1₁₀</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(16, 185, 129, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">0₁₁</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">1₁₂</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(16, 185, 129, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₃</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">1₁₄</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(16, 185, 129, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">0₁₅</span></td>
    </tr>
  </table>

  <!-- Group 2 (P2): Covers 2, 3, 6, 7, 10, 11, 14, 15 -->
  <table style="border-collapse: collapse; text-align: center; border: 2px solid var(--card-border);">
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₀</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₁</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(245, 158, 11, 0.15);"><span style="color:#F59E0B; font-weight: bold; font-size: 0.85em;">X₂</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(245, 158, 11, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">0₃</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₄</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">0₅</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(245, 158, 11, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">1₆</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(245, 158, 11, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">1₇</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₈</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">0₉</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(245, 158, 11, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₀</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(245, 158, 11, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">0₁₁</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">1₁₂</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">1₁₃</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(245, 158, 11, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₄</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(245, 158, 11, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">0₁₅</span></td>
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
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(139, 92, 246, 0.15);"><span style="color:#8B5CF6; font-weight: bold; font-size: 0.85em;">X₄</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(139, 92, 246, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">0₅</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(139, 92, 246, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">1₆</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(139, 92, 246, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">1₇</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₈</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">0₉</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">1₁₀</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">0₁₁</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(139, 92, 246, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₂</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(139, 92, 246, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₃</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(139, 92, 246, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₄</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(139, 92, 246, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">0₁₅</span></td>
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
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(236, 72, 153, 0.15);"><span style="color:#EC4899; font-weight: bold; font-size: 0.85em;">X₈</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(236, 72, 153, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">0₉</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(236, 72, 153, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₀</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(236, 72, 153, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">0₁₁</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(236, 72, 153, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₂</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(236, 72, 153, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₃</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(236, 72, 153, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₄</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(236, 72, 153, 0.15);"><span style="color:var(--text-main); font-size: 0.85em;">0₁₅</span></td>
    </tr>
  </table>

</div>

The matrices above showcase the subgroups that are covered by each parity bit.
The parity bit is added to ensure that there is always even parity for each
group. To illustrate how this works, we will utilize the above matrix and fill
in the parity codes.

<div style="display: flex; justify-content: center; margin: 3rem 0;">
  <table style="border-collapse: collapse; text-align: center; border: 2px solid var(--card-border);">
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:var(--text-muted); font-size: 1.1em;">X₀</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem; background: rgba(16, 185, 129, 0.15);"><span style="color:#10B981; font-weight: bold; font-size: 1.1em;">0₁</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem; background: rgba(245, 158, 11, 0.15);"><span style="color:#F59E0B; font-weight: bold; font-size: 1.1em;">1₂</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:var(--text-main); font-size: 1.1em;">0₃</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem; background: rgba(139, 92, 246, 0.15);"><span style="color:#8B5CF6; font-weight: bold; font-size: 1.1em;">1₄</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:var(--text-main); font-size: 1.1em;">0₅</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:var(--text-main); font-size: 1.1em;">1₆</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem;"><span style="color:var(--text-main); font-size: 1.1em;">1₇</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.8rem 1.5rem; background: rgba(236, 72, 153, 0.15);"><span style="color:#EC4899; font-weight: bold; font-size: 1.1em;">1₈</span></td>
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

Now that we have created the matrix, we can insert a random error and see how
the receiving device determines the error bit and corrects it.

### Step-by-Step Isolation

To isolate the error, the receiver checks each parity group. Any group with an
"odd" parity (a sum of bits that doesn't match the expected even parity) is
flagged. By looking at the intersection of these failing groups, we can pinpoint
the exact bit that flipped.

<div style="display: flex; flex-direction: row; justify-content: center; align-items: flex-start; gap: 40px; flex-wrap: wrap; margin: 3rem 0;">

  <!-- Step 1: Identify Failing Groups (Heatmap) -->
  <div style="text-align: center;">
    <p style="margin-bottom: 1rem; font-weight: bold; color: var(--accent);">1. Identify Failing Groups</p>
    <table style="border-collapse: collapse; text-align: center; border: 2px solid var(--card-border);">
      <tr>
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₀</span></td>
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(16, 185, 129, 0.2);"><span style="color:#10B981; font-weight: bold; font-size: 0.85em;">X₁</span></td>
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(245, 158, 11, 0.2);"><span style="color:#F59E0B; font-weight: bold; font-size: 0.85em;">X₂</span></td>
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 50%, rgba(245, 158, 11, 0.1) 50%);"><span style="color:var(--text-main); font-size: 0.85em;">0₃</span></td>
      </tr>
      <tr>
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₄</span></td>
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(16, 185, 129, 0.1);"><span style="color:var(--text-main); font-size: 0.85em;">0₅</span></td>
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(245, 158, 11, 0.1);"><span style="color:var(--text-main); font-size: 0.85em;">1₆</span></td>
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 50%, rgba(245, 158, 11, 0.1) 50%);"><span style="color:var(--text-main); font-size: 0.85em;">1₇</span></td>
      </tr>
      <tr>
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(236, 72, 153, 0.2);"><span style="color:#EC4899; font-weight: bold; font-size: 0.85em;">X₈</span></td>
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 50%, rgba(236, 72, 153, 0.1) 50%);"><span style="color:var(--text-main); font-size: 0.85em;">0₉</span></td>
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 50%, rgba(236, 72, 153, 0.1) 50%);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₀</span></td>
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 33%, rgba(245, 158, 11, 0.2) 33% 66%, rgba(236, 72, 153, 0.2) 66%);"><span style="color:#ef4444; font-weight: bold; font-size: 0.85em;">1₁₁</span></td>
      </tr>
      <tr>
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(236, 72, 153, 0.1);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₂</span></td>
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 50%, rgba(236, 72, 153, 0.1) 50%);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₃</span></td>
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 50%, rgba(236, 72, 153, 0.1) 50%);"><span style="color:var(--text-main); font-size: 0.85em;">1₁₄</span></td>
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 33%, rgba(245, 158, 11, 0.1) 33% 66%, rgba(236, 72, 153, 0.1) 66%);"><span style="color:var(--text-main); font-size: 0.85em;">0₁₅</span></td>
      </tr>
    </table>
    <p style="font-size: 0.8rem; margin-top: 0.5rem; color: var(--text-muted);">P1 (Green), P2 (Amber), and P8 (Pink) fail.</p>
  </div>

  <!-- Step 2: Isolated Intersection -->
  <div style="text-align: center;">
    <p style="margin-bottom: 1rem; font-weight: bold; color: var(--accent);">2. Isolate Intersection</p>
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
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">X₈</span></td>
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">0₉</span></td>
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">1₁₀</span></td>
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem; background: rgba(239, 68, 68, 0.4);"><span style="color:#ef4444; font-weight: bold; font-size: 0.85em;">1₁₁</span></td>
      </tr>
      <tr>
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">1₁₂</span></td>
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">1₁₃</span></td>
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">1₁₄</span></td>
        <td style="border: 1px solid var(--card-border); padding: 0.4rem 0.6rem;"><span style="color:var(--text-muted); font-size: 0.85em;">0₁₅</span></td>
      </tr>
    </table>
    <p style="font-size: 0.8rem; margin-top: 0.5rem; color: var(--text-muted);">Binary sum 1+2+8 = 11. Bit 11 is isolated.</p>
  </div>

</div>

<div style="display: flex; flex-direction: row; justify-content: center; align-items: center; gap: 40px; flex-wrap: wrap; margin: 3rem 0;">
  <!-- Error Matrix (Bit 11 flipped) -->
  <table style="border-collapse: collapse; text-align: center; border: 2px solid var(--card-border);">
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:var(--text-muted); font-size: 1em;">X₀</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:#10B981; font-weight: bold; font-size: 1em;">0₁</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:#F59E0B; font-weight: bold; font-size: 1em;">1₂</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:var(--text-main); font-size: 1em;">0₃</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:#8B5CF6; font-weight: bold; font-size: 1em;">1₄</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:var(--text-main); font-size: 1em;">0₅</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:var(--text-main); font-size: 1em;">1₆</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:var(--text-main); font-size: 1em;">1₇</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:#EC4899; font-weight: bold; font-size: 1em;">1₈</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:var(--text-main); font-size: 1em;">0₉</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:var(--text-main); font-size: 1em;">1₁₀</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem; background: rgba(239, 68, 68, 0.2);"><span style="color:#ef4444; font-weight: bold; font-size: 1em;">1₁₁</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:var(--text-main); font-size: 1em;">1₁₂</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:var(--text-main); font-size: 1em;">1₁₃</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:var(--text-main); font-size: 1em;">1₁₄</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:var(--text-main); font-size: 1em;">0₁₅</span></td>
    </tr>
  </table>

  <div style="font-size: 2rem; color: var(--text-muted);">&rarr;</div>

  <!-- Corrected Matrix -->
  <table style="border-collapse: collapse; text-align: center; border: 2px solid var(--card-border);">
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:var(--text-muted); font-size: 1em;">X₀</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:#10B981; font-weight: bold; font-size: 1em;">0₁</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:#F59E0B; font-weight: bold; font-size: 1em;">1₂</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:var(--text-main); font-size: 1em;">0₃</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:#8B5CF6; font-weight: bold; font-size: 1em;">1₄</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:var(--text-main); font-size: 1em;">0₅</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:var(--text-main); font-size: 1em;">1₆</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:var(--text-main); font-size: 1em;">1₇</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:#EC4899; font-weight: bold; font-size: 1em;">1₈</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:var(--text-main); font-size: 1em;">0₉</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:var(--text-main); font-size: 1em;">1₁₀</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem; background: rgba(16, 185, 129, 0.2);"><span style="color:#10b981; font-weight: bold; font-size: 1em;">0₁₁</span></td>
    </tr>
    <tr>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:var(--text-main); font-size: 1em;">1₁₂</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:var(--text-main); font-size: 1em;">1₁₃</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:var(--text-main); font-size: 1em;">1₁₄</span></td>
      <td style="border: 1px solid var(--card-border); padding: 0.6rem 1rem;"><span style="color:var(--text-main); font-size: 1em;">0₁₅</span></td>
    </tr>
  </table>
</div>

Now that we understand the basics of Hamming codes, we can introduce the special
behavior for index 0. Index zero allows us to detect up to two errors. While
this bit doesn't enable correction, the ability to detect multiple errors is
still very important. This bit acts as a parity for the entire matrix; if the
parity doesn't add up correctly, we know there is a mistake.

Above what was explained is known as (15, 11) Hamming code since it contains 
four parity bits (15-11 = 4), and can be considered part of the extended 
Hamming code if utilizing the 5th parity bit at index 0. Thi setup allows 
for correction of one bit error, and the detection of two bit errors making 
it a fairly useful algorithm. This error correction technique can be scaled 
up fairly easily to larger size. While I will not be discussing that here 
right now. I will leave that as a challenge for you to deepen your 
understanding for Hamming codes.

# Reed-Solomon
Coming Soon

# Challenge Question Solutions

## Question 1

There are a couple of different approaches for this question.

### Solution 1

The first solution involves summing the expected array and subtracting the sum
of the received array from it. The difference will provide the missing value.
$$
\begin{aligned} \\
S_{expected} &= \frac{n(n+1)}{2} \\
S_{actual} &= \sum_{i=1}^{n-1} a_i \\
d &= S_{expected} - S_{actual} \\
\end{aligned} \\
$$

### Solution 2

This solution follows the same principles as the first, but it is approached
from a logic gate perspective. In hardware, there is one particular gate that
allows us to determine if there is a difference between two numbers: the XOR
gate. If we XOR each number in the expected array and the received array
separately, we get a unique output that can then be used to identify the missing
number by XORing them together.

$$
\begin{aligned} \\
X_{expected} &= \bigoplus_{i=1}^{N} i = i_1 \oplus i_1 \oplus i_2 ... i_
{N-1} \oplus i_N \\
X_{actual} &= \bigoplus_{i=1}^{N-1} a_i \\
d &= X_{expected} \oplus X_{actual} \\
\end{aligned} \\
$$

To highlight how this works, I have provided a simple example below where N = 5
and 3 is the missing element.
$$
\begin{aligned} \\
\text{Expected: } X_{exp} &= 3'b001 \oplus 3'b010 \oplus 3'b011 \oplus 3'b100 \oplus 3'b101 \\
&= 3'b001 \\
\text{Actual: } X_{act} &= 3'b001 \oplus 3'b010 \oplus 3'b100 \oplus 3'b101 \\
&= 3'b010 \\
\hline \\
\text{Dropped: } d &= X_{exp} \oplus X_{act} \\
&= 3'b001 \oplus 3'b010 \\
&= 3'b011 \\
\end{aligned} \\
$$

## Question 2
The second question is a bit trickier, but it utilizes fairly similar ideas to 
Question 1.

### Solution 1
The first solution involves creating two sets of equations to solve for the two 
missing variables. The first equation is based on the sum of the numbers in the 
list, similar to Question 1. The second equation, however, is based on the sum 
of squares. With these two equations, we can then solve for the missing variables.

Let the two missing numbers be $x$ and $y$.
From the sum of numbers:
$$ S_1 = \sum_{i=1}^{N} i - \sum_{j=1}^{N-2} a_j = x + y $$
From the sum of squares:
$$ S_2 = \sum_{i=1}^{N} i^2 - \sum_{j=1}^{N-2} a_j^2 = x^2 + y^2 $$

We know that:
$$(x+y)^2 = x^2 + y^2 + 2xy$$
So, we can find $xy$:
$$ xy = \frac{(x+y)^2 - (x^2+y^2)}{2} = \frac{S_1^2 - S_2}{2} $$

Now we have the sum ($S_1$) and the product ($xy$) of the two missing numbers. We can form a quadratic equation:
$$ t^2 - S_1 t + xy = 0 $$
Solving this quadratic equation for $t$ will give us the values of $x$ and $y$.

### Solution 2

Having seen the more mathematically elegant Solution 1, we can now approach this problem from a logic gate perspective — the same angle used in Question 1, Solution 2.

The key insight is that with two missing elements, we can reduce the problem into two independent single-missing-element problems, each solvable with XOR.

**Step 1: Find the sum of the two missing numbers.**

Just as in Question 1 Solution 1, compute the difference between the expected sum and the actual sum:

$$
\begin{aligned} \\
S_1 &= \sum_{i=1}^{N} i - \sum_{j=1}^{N-2} a_j = x + y \\
\end{aligned} \\
$$

**Step 2: Partition the problem using the midpoint.**

Take the average of $S_1$ to find a midpoint $m$ that splits the number line into two halves, guaranteeing one missing number falls in each half:

$$
m = \left\lfloor \frac{S_1}{2} \right\rfloor
$$

Numbers from $1$ to $m$ form the **lower half**, and numbers from $m+1$ to $N$ form the **upper half**. Since $x + y = S_1$ and $m = \lfloor S_1 / 2 \rfloor$, one of the missing values must be $\leq m$ and the other must be $> m$.

**Step 3: Apply XOR to each half independently.**

This reduces to two separate instances of Question 1, Solution 2. For each half, XOR the expected values against the values present in the received array:

$$
\begin{aligned} \\
x &= \bigoplus_{i=1}^{m} i \;\oplus\; \bigoplus_{\substack{j \in \text{actual} \\ a_j \leq m}} a_j \\
y &= \bigoplus_{i=m+1}^{N} i \;\oplus\; \bigoplus_{\substack{j \in \text{actual} \\ a_j > m}} a_j \\
\end{aligned} \\
$$

Each XOR isolates the single missing element in its respective half, yielding both $x$ and $y$ without any multiplication or division — making this approach highly efficient for hardware implementation.

*Disclaimer: LLMs were used for research and formatting assistance only. All content has been reviewed and verified for accuracy. If you have any questions or points of contention, please reach out.*
