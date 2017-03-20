Number Boggle for Code-Foo 2017 Application:

Following the directions, this app takes a grid of numbers (default 3x3) and finds all chains that, when summed, add up to the area of the grid. Chains should not repeat the same digits, and should be at least of length grid width-1.

The bulk of the work is in the bogglish.js file. Loading main.html in your browser should make an easy hook for the program.

Because of the nature of my solution, I went ahead and made the program scalable. The user can input their desired width and the program will run with that number to create an NxN area. It scales reasonably well until about a 30x30 grid is described. At this point there is a noticeable delay (about two seconds) before solutions are displayed. A 50x50 grid takes around 30 seconds to complete. During this time the screen seems inactive. The answer are also... a bit harder to read at this point as there are so many digits in the chain.

My process to complete this problem was as follows:

1. Create a program that makes a valid NxN grid based on the user's input. I'd done something of this nature before so it didn't take too much time.

2. Find sums of numbers that add up to the area. This was a logical step that should have broken down a bit more. I should have tackled how to ensure digits in the grid see the correct digits next to them. Because the grid is just one long array, there are some edge cases where by going by my directions, digits could sometimes see digits they should not be able to. For example a digit on the left hand side seeing the digit to the left of it in the array. From a logic perspective this was the NW digit, but it didn't translate well. I had to write some exceptions for this.

3. Back to finding sums that met the total. This part was relatively straightforward once I had made certain all the numbers of the grid were seeing the correct numbers.

4. Push those complete chains to an intermediary place, and make sure that the chain wasn't already in the list of answers for this particular seed number [i.e. each digit in the array as starter]. This took some time as I hadn't dealt much with javascript's find method. I kept record of both value and index for each digit in a chain so I could compare in case there were multiple of the same digit in an array (like 0).

5. I then worked on a process that, once a chain had been completed, the chain would pop off the latest number, and go back a step, to see if there was another answer available to it. This would quickly make new answers based on work that had already been done. It continued along this chain until it reached its seed and the last direction had been expended.

6. The way that my sum method worked, it was pushing to my answers array as soon as the sum was reached. I realized at this point that would cause a problem if there was a 0 after the sum had been reached. I spend some time trying to work this out, before realizing that the problem would take care of itself by virtue of the fact that at some point, that same 0 would become the origin and would pick up all the numbers from the previous chain.

7. At this point the final digit has been summed up after being the origin and I had one array of answers chains for each origin digit. I then return this array to the function that called it, dumping each answer into a new array. Because each origin digit has the potential to have the exact same chain as another origin digit (but never twice within its own array), I still had to weed out repeats. This is done with lines 61-93 of bogglish.js. If there is anywhere to clean up to make this program run more efficiently it is probably here.

8. By now we have a complete array of all valid answers without repeats. All that was left was to concatenate the answers so they would print out properly.

During all of this, until about step 5, I was spending a lot of time putting all my logic into three functions: drawing the grid, collecting answers, and adding sums together. It became somewhat messy and I realized that my "temporary experiments" were getting more numerous and more difficult to keep track of. The result of this is that I started writing more functions to help with smaller work. I could make a change in just the function and see how it affected the rest of the program without having to search for what changes I'd just done. I think there is still room for improvement for this.

