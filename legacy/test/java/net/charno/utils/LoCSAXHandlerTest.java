package net.charno.utils;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by charno on 8/30/16.
 */
public class LoCSAXHandlerTest {

    private LoCSAXHandler locHandler;

    @Before
    public void setup() throws Exception {
        locHandler = new LoCSAXHandler();
    }

    @Test
    public void testStartElement() throws Exception {
        locHandler.startElement(null, null, "uri", null);
        // Could use a spy here to inspect values for uriFound, literalFound and URILabelBinding()
    }

    @Test
    public void testEndElement() throws Exception {

    }

    @Test
    public void testCharacters() throws Exception {

    }
}