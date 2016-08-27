package net.charno.utils;

import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by charno on 8/27/16.
 */
public class StringUtilsTest {

    @Test
    public void testMakeURLSafe() throws Exception {
        String dodgyURL = "\n\r ;:/\"#&?+@={}[]<>";
        String expected = "%20%20%20%3B%3A%2F%22%23%26%3F%2B%40%3D%7B%7D%5B%5D%3C%3E";

        assertEquals(expected, StringUtils.makeURLSafe(dodgyURL));
    }

    @Test
    public void testCapitalise() throws Exception {
        String lowercase = "test";
        String uppercase = "Test";
        String dodgycase = " test";
        String expected = "Test";

        assertEquals(expected, StringUtils.capitalise(lowercase));
        assertEquals(expected, StringUtils.capitalise(uppercase));
        assertEquals(expected, StringUtils.capitalise(dodgycase));
    }
}